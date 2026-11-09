<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import type { GlitchRippleProps } from './types'
import type {
  GlitchRippleIntensity,
  GlitchRippleSpeed,
} from './types'

defineOptions({
  name: 'MyuiGlitchRipple',
})

const props = withDefaults(defineProps<GlitchRippleProps>(), {
  intensity: 'normal',
  speed: 'normal',
  trigger: 'auto',
  active: true,
  motionPreference: 'system',
  as: 'span',
})

/**
 * HOW THIS WORKS (the part worth reading before changing a number)
 * -----------------------------------------------------------------------------
 * 故障波纹 is a *displacement* effect, not decoration. The content is pushed
 * around per-pixel by a noise field:
 *
 *   feTurbulence  builds a fractal-noise field (Perlin noise). Deliberately
 *                 anisotropic — 0.002 on x, 0.08 on y — so the field is almost
 *                 constant horizontally and repeats every ~12px vertically. That
 *                 is what turns the distortion into horizontal *bands* instead of
 *                 a soup of random pixels.
 *   feComponentTransfer  re-centres that field: the rasteriser's noise averages
 *                 ~0.73 instead of 0.5, and feDisplacementMap displaces by
 *                 (channel − 0.5). Left alone, that bias slides the *whole box*
 *                 one way — the "floating" look. This stage maps the mean onto
 *                 0.5 and doubles the contrast, so displacement is symmetric and
 *                 reads as a tear. See the constants in the template.
 *   feOffset      slides the field over time. Sliding the map is what makes the
 *                 bands *travel* — a ripple, not a still warp. The slide is
 *                 bounded on purpose: the noise only exists inside the filter
 *                 region, so an unbounded slide empties the field and the ripple
 *                 dies. See DRIFT_* below.
 *   feDisplacementMap  reads the field's R channel for x displacement and G for y,
 *                 and moves every pixel of the content by that much.
 *
 * No duplicated content, no pseudo-element copies, no filter on a clone: the
 * source graphic is the slot, so anything can be wrapped — text, a button, a card,
 * an image.
 *
 * THE FROZEN FRAME
 * The markup's initial filter values are a *mild* warp, and the rAF loop is the
 * only thing that overwrites them. So on a machine with animations off (this
 * project's dev machine is one), during SSR, or in a screenshot, the content still
 * looks like a slightly unstable signal — it never falls back to looking
 * untouched. That is the same rule the library's other effects follow.
 */

/* -------------------------------------------------------------------------- */
/* tuning tables                                                              */
/* -------------------------------------------------------------------------- */

/** How hard the field bends the content, relative to the wrapper's own size. */
const LEVEL: Record<GlitchRippleIntensity, number> = {
  subtle: 0.55,
  normal: 1,
  intense: 1.85,
}

/** One full travel of the field, in ms. */
const CYCLE: Record<GlitchRippleSpeed, number> = {
  slow: 6200,
  normal: 3800,
  fast: 2200,
}

const level = computed(() => LEVEL[props.intensity] ?? 1)
const cycle = computed(() => CYCLE[props.speed] ?? 3800)

/* -------------------------------------------------------------------------- */
/* drift                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The field drifts, but only inside the room it actually has — and that is the
 * whole correction. `feTurbulence` generates noise *over the filter region*:
 * -30% … 130% of the box, i.e. 30% of the box on every side. `feOffset` slides
 * that field, and anywhere it has slid off the region samples nothing.
 * `feDisplacementMap` reads an empty sample as channel 0, which is not "no
 * distortion" but a *constant* one — every pixel moves the same way. So an
 * unbounded slide does not fade the effect out, it converts the ripple into a
 * whole-box offset. Measured on the docs hero title (233px tall, 70px of
 * headroom): `dy` was 73px after one second and 1399px after forty, and the
 * title had become a clean, uniformly shifted copy of itself.
 *
 * So the drift is a bounded wander instead of an endless slide: two
 * incommensurate sines (one per axis) inside 60% of the measured headroom. It
 * never reaches an edge, it never repeats in step, and because the two axes run
 * at different rates it reads as a field that will not settle rather than as a
 * band bouncing off a wall. The previous version's comment said a modulo "would
 * show up as a jump" because turbulence is not periodic — that is right, and it
 * is exactly why this is bounded rather than wrapped.
 */
const DRIFT_ROOM = 0.6
/** Lateral wander, rad/s. Deliberately not a multiple of the vertical rate. */
const DRIFT_SPEED_X = 0.17
/** The visible travel of the bands, rad/s. */
const DRIFT_SPEED_Y = 1

/** How far the field may drift on each axis before its own edge would show. */
const roomX = ref(0)
const roomY = ref(0)

/* -------------------------------------------------------------------------- */
/* filter identity                                                            */
/* -------------------------------------------------------------------------- */

const uid = useId()
const filterId = `myui-glitch-ripple-${uid.replace(/[^\w-]/g, '')}`

/* -------------------------------------------------------------------------- */
/* element + field state                                                      */
/* -------------------------------------------------------------------------- */

const host = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const noiseEl = ref<SVGFEOffsetElement | null>(null)
const mapEl = ref<SVGFEDisplacementMapElement | null>(null)

/**
 * Displacement is measured in pixels, so a 22px tag and a 280px card cannot share
 * a constant: this is the field strength for *this* box. Never zero — a wrapper
 * around a 1px-tall inline box must still ripple.
 */
const unit = ref(2.4)

/**
 * The three numbers the filter actually reads. rAF writes them per frame.
 * Two offsets, not one: a single axis makes the drift reverse on itself every
 * half period, which reads as a bounce. Two rates never line up, so the field
 * wanders.
 */
const fieldScale = ref(1.25)
const fieldShiftX = ref(0)
const fieldShiftY = ref(3.8)

const reduced = ref(false)
const hovered = ref(false)
const focused = ref(false)

/** Whether the content should carry the filter at all. */
const distorting = computed(
  () =>
    props.active &&
    (props.trigger === 'auto' || hovered.value || focused.value) &&
    unit.value > 0,
)

/**
 * Where in the flicker track this instance starts, and how fast it runs it.
 *
 * The stylesheet supplies a track that has no countable beat in it (sixteen dips
 * of varying depth and spacing over ~19.2s). This is the second half of "random":
 * without it, every wrapper on a page — and the same wrapper on every reload —
 * drops out in exactly the same places, which a viewer reads as a loop, not as a
 * failing signal.
 *
 * `stretch` is clamped to ≥ 1 on purpose. Slowing the track lengthens the gap
 * between dips, which is always safe; speeding it up is the one direction that
 * could push the cadence past the three-flashes-per-second guideline the
 * stylesheet's track is sized against.
 *
 * It is written in `onMounted`, never during setup: `Math.random()` in a render
 * would make the server's HTML and the client's disagree on the style attribute
 * and trip hydration on a VitePress page. SSR renders the neutral values from the
 * stylesheet and the phase is applied once the client is alive.
 */
const flickerPhase = ref<Record<string, string> | null>(null)

/** The track's own length, in ms — only used to pick a random entry point. */
const FLICKER_TRACK_MS = 19200

/** Deliberately not a new variable: the filter needs an id, and an id is local. */
const contentStyle = computed(() => ({
  filter: distorting.value ? `url(#${filterId})` : 'none',
  ...(flickerPhase.value ?? {}),
}))

/** Static values that hold when nothing is animating — the frozen frame. */
function frozenValues(): { scale: number; shiftX: number; shiftY: number } {
  const strength = unit.value * level.value
  // 0.7 is not a demo-friendly exaggeration: it is the smallest warp that still
  // reads as "this signal is not stable" at a glance on a machine where the
  // ripple itself never moves.
  return {
    scale: strength * 0.7,
    shiftX: 0,
    // A still frame is not allowed to push the field further than the live drift
    // does — same headroom, same reason (an empty sample is a flat offset).
    shiftY: Math.min(strength * 2.2, roomY.value * DRIFT_ROOM),
  }
}

const isMotionAllowed = computed(
  () => !reduced.value || props.motionPreference === 'always',
)

/**
 * The ripple's displacement has to be scripted, but the other two halves of
 * "signal is failing" — the tremble and the fade — are pure presentation and stay
 * in CSS keyframes. They are gated on this flag so a frozen or inactive wrapper
 * does not keep animating a layer that is supposed to be still.
 */
const isAnimating = computed(() => distorting.value && isMotionAllowed.value)

/* -------------------------------------------------------------------------- */
/* painting                                                                   */
/* -------------------------------------------------------------------------- */

let raf = 0
let startedAt = 0
let lastPaint = 0

/**
 * Paint one frame.
 * The refs and the live attributes are written together on purpose: the template
 * binds the same three values, so if Vue ever re-renders (a class flip on hover,
 * a prop change) the patch replays the *current* numbers instead of resetting the
 * filter to its initial state. Writing only the DOM node would be cheaper and
 * would also work — until the first re-render silently undid it.
 */
function paint(scale: number, shiftX: number, shiftY: number): void {
  const roundedScale = Math.round(scale * 100) / 100
  const roundedX = Math.round(shiftX * 10) / 10
  const roundedY = Math.round(shiftY * 10) / 10

  fieldScale.value = roundedScale
  fieldShiftX.value = roundedX
  fieldShiftY.value = roundedY

  const map = mapEl.value
  const noise = noiseEl.value
  if (map) map.setAttribute('scale', String(roundedScale))
  if (noise) {
    noise.setAttribute('dx', String(roundedX))
    noise.setAttribute('dy', String(roundedY))
  }
}

function frame(now: number): void {
  raf = window.requestAnimationFrame(frame)

  // Throttled: a displacement field at 60fps costs more than it shows, and the
  // ripple reads the same at 30.
  if (now - lastPaint < 1000 / 30) return
  lastPaint = now

  if (document.visibilityState === 'hidden') return

  const t = (now - startedAt) / 1000
  const c = cycle.value / 1000
  const strength = unit.value * level.value

  // Breathing amplitude: the signal is never quite steady. Two incommensurate
  // sines rather than one — a single sine on a fixed period is a pump the eye can
  // count, which is the same metronome problem the flicker had.
  const breath =
    0.74 +
    0.2 * Math.sin((t / (c * 0.5)) * Math.PI * 2) +
    0.12 * Math.sin(t * 0.71 + 1.3)

  // One hard cut every so often: a ~90ms slice where the field jolts. Without it
  // this is a water ripple; with it, it is a *broken* signal. The interval and
  // the strength are both drawn fresh each time — a cut on a fixed phase of the
  // cycle is exactly the countable beat this effect must not have.
  const cut = drawCut(t)

  // Bounded by construction (see DRIFT_*): each axis stays inside the filter
  // region's own headroom, so the field always has something to show. The two
  // rates are tied to `speed` so the prop still means something for the drift.
  const pace = 3800 / cycle.value
  const shiftX = roomX.value * DRIFT_ROOM * Math.sin(t * DRIFT_SPEED_X * pace)
  const shiftY = roomY.value * DRIFT_ROOM * Math.sin(t * DRIFT_SPEED_Y * pace + 1.7)

  paint(strength * breath * cut, shiftX, shiftY)
}

/* -------------------------------------------------------------------------- */
/* the jolt                                                                   */
/* -------------------------------------------------------------------------- */

/** Seconds between the *starts* of two cuts: short enough to stay a signal. */
const CUT_GAP_MIN = 2.2
const CUT_GAP_MAX = 6.4
/** How long a cut lasts, and how hard it pushes. Both random, both bounded. */
const CUT_LENGTH_MIN = 0.085
const CUT_LENGTH_MAX = 0.14
const CUT_PUSH_MIN = 1.55
const CUT_PUSH_MAX = 2.15

let nextCutAt = Number.NaN
let cutUntil = -1
let cutPush = 1

/**
 * Returns this frame's multiplier: `1` almost always, a random push for the
 * duration of a cut. Scheduling happens on the frame the cut starts, so the
 * randomness costs one `Math.random()` every few seconds rather than per frame.
 */
function drawCut(t: number): number {
  if (Number.isNaN(nextCutAt)) {
    // Nothing fires on the very first frames: the page has just appeared and a
    // jolt at load reads as a bug rather than as a signal.
    nextCutAt = t + 1.1 + Math.random() * 2.4
  }

  if (t >= nextCutAt) {
    cutPush = CUT_PUSH_MIN + Math.random() * (CUT_PUSH_MAX - CUT_PUSH_MIN)
    cutUntil = t + CUT_LENGTH_MIN + Math.random() * (CUT_LENGTH_MAX - CUT_LENGTH_MIN)
    nextCutAt = t + CUT_GAP_MIN + Math.random() * (CUT_GAP_MAX - CUT_GAP_MIN)
  }

  return t < cutUntil ? cutPush : 1
}

function stop(): void {
  if (raf) {
    window.cancelAnimationFrame(raf)
    raf = 0
  }
}

function freeze(): void {
  const { scale, shiftX, shiftY } = frozenValues()
  paint(scale, shiftX, shiftY)
}

function sync(): void {
  if (!distorting.value) {
    stop()
    paint(0, 0, 0)
    return
  }

  if (!isMotionAllowed.value) {
    stop()
    freeze()
    return
  }

  if (!raf) {
    startedAt = performance.now()
    lastPaint = 0
    raf = window.requestAnimationFrame(frame)
  }
}

/* -------------------------------------------------------------------------- */
/* measurement                                                                */
/* -------------------------------------------------------------------------- */

let observer: ResizeObserver | null = null

function measure(): void {
  const el = content.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  // An inline text box can have a zero-ish height in some layouts; fall back to
  // the font size so a text-mode ripple is never invisible.
  const font = Number.parseFloat(window.getComputedStyle(el).fontSize) || 16
  const smallest = Math.min(width || font, Math.max(height, font * 1.1))

  // 5% of the smaller side plus a floor, capped so a huge card stays a glitch
  // and not soup.
  //
  // The 3.4 floor is not padding. A bare `smallest * 0.05` put a small label on
  // ~1.2, where the band amplitude (field std × scale) is well under a pixel and
  // the only motion left on screen is the CSS tremble — a whole-box translate,
  // i.e. exactly the "floating" read this component must not produce. The floor
  // keeps the *tear* bigger than the shiver at every size.
  // This clamp is the only one: `unit` is read directly as the displacement scale
  // below, so a second clamp in the paint path would just be a number to get wrong.
  unit.value = Math.min(10, Math.max(3.4, 3.4 + smallest * 0.05))

  // The drift's budget comes from the filter region, which is the markup's
  // -30% … 130% — so it is measured here rather than guessed, and it scales with
  // the box the way `unit` does. Zero-sized boxes (jsdom, a display:none host)
  // fall back to the font box so the numbers are never 0.
  roomX.value = (width || font) * 0.3
  roomY.value = Math.max(height, font) * 0.3
}

/* -------------------------------------------------------------------------- */
/* lifecycle                                                                  */
/* -------------------------------------------------------------------------- */

let mediaQuery: MediaQueryList | null = null

function onReducedChange(event: MediaQueryListEvent | MediaQueryList): void {
  reduced.value = event.matches
}

onMounted(() => {
  measure()

  // The flicker's random half, applied once the client is alive (see
  // `flickerPhase`). A negative delay starts the track partway in, which is
  // exactly "start at a random point in the loop".
  flickerPhase.value = {
    '--myui-gr-flicker-delay': `${Math.round(-Math.random() * FLICKER_TRACK_MS)}ms`,
    '--myui-gr-flicker-stretch': (1 + Math.random() * 0.35).toFixed(2),
  }

  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => {
      measure()
      sync()
    })
    if (content.value) observer.observe(content.value)
  }

  if (typeof window.matchMedia === 'function') {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    onReducedChange(mediaQuery)
    mediaQuery.addEventListener('change', onReducedChange)
  }

  // The static frame goes in first: if anything below throws, or the user never
  // hovers, the content still carries the effect.
  if (props.active && props.trigger === 'auto') freeze()
  sync()
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  observer = null
  mediaQuery?.removeEventListener('change', onReducedChange)
  mediaQuery = null
})

watch(
  () => [props.active, props.intensity, props.speed, props.trigger, props.motionPreference],
  () => {
    measure()
    sync()
  },
)

function onEnter(): void {
  hovered.value = true
  sync()
}

function onLeave(): void {
  hovered.value = false
  sync()
}

function onFocusIn(): void {
  focused.value = true
  sync()
}

function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget as Node | null
  if (next && host.value?.contains(next)) return
  focused.value = false
  sync()
}

const classes = computed(() => [
  'myui-glitch-ripple',
  `myui-glitch-ripple--${props.intensity}`,
  `myui-glitch-ripple--${props.speed}`,
  `myui-glitch-ripple--${props.trigger}`,
  {
    'myui-glitch-ripple--text': props.text !== undefined,
    'myui-glitch-ripple--force-motion': props.motionPreference === 'always',
    'is-active': props.active,
    'is-distorting': distorting.value,
    'is-animating': isAnimating.value,
  },
])
</script>

<template>
  <component
    :is="as"
    ref="host"
    :class="classes"
    :data-intensity="intensity"
    :data-speed="speed"
    :data-trigger="trigger"
    :data-active="active ? 'true' : 'false'"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <!-- The paint server. Zero-sized and aria-hidden: it exists only so the
         content's `filter: url(#…)` has something to point at. -->
    <svg class="myui-glitch-ripple__filter" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter
          :id="filterId"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.002 0.08"
            numOctaves="2"
            seed="2"
            stitchTiles="stitch"
            result="field"
          />
          <!-- ZERO-MEAN THE FIELD BEFORE DISPLACING WITH IT.
               feDisplacementMap moves a pixel by (channel − 0.5) × scale, so a
               noise field whose average sits above 0.5 translates the whole box
               instead of tearing it: every pixel shifts the same way and the
               effect reads as "floating", not as a broken signal. Chrome/Skia's
               feTurbulence does exactly that — measured on this exact filter
               config (fractalNoise, seed 2, numOctaves 2) the R channel averages
               0.7295 and G 0.7291 (std 0.082 / 0.085); re-measuring with
               baseFrequency 0.002 0.16 and 0.006 0.08 gave the same means, so it
               is a rasteriser bias rather than sampling noise.

               This transfer maps each channel mean onto 0.5 and doubles the
               contrast, which turns the old one-directional drift into a
               symmetric tear:
                 intercept = 0.5 − slope × measured mean
                 R   : 0.5 − 2.45 × 0.7295 = −1.2873
                 G/B : 0.5 − 2.37 × 0.7291 = −1.2280

               The numbers are hard-coded on purpose: they are measurements. If
               baseFrequency, numOctaves, seed or the turbulence type ever change,
               re-measure the channel means first — otherwise the whole-box
               offset comes straight back. (feFuncA stays identity: the alpha
               channel never feeds the displacement.) -->
          <feComponentTransfer in="field" result="centered">
            <feFuncR type="linear" slope="2.45" intercept="-1.2873" />
            <feFuncG type="linear" slope="2.37" intercept="-1.2280" />
            <feFuncB type="linear" slope="2.37" intercept="-1.2280" />
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feOffset
            ref="noiseEl"
            in="centered"
            :dx="fieldShiftX"
            :dy="fieldShiftY"
            result="shifted" />
          <feDisplacementMap
            ref="mapEl"
            in="SourceGraphic"
            in2="shifted"
            :scale="fieldScale"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <span ref="content" class="myui-glitch-ripple__content" :style="contentStyle">
      <span v-if="text !== undefined">{{ text }}</span>
      <slot v-else />
    </span>
  </component>
</template>
