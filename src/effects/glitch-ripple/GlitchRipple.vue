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
 *   feOffset      slides the field up over time. Sliding the map is what makes the
 *                 bands *travel* — a ripple, not a still warp.
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

/** The two numbers the filter actually reads. rAF writes them per frame. */
const fieldScale = ref(1.25)
const fieldShift = ref(3.8)

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

/** Deliberately not a new variable: the filter needs an id, and an id is local. */
const contentStyle = computed(() => ({
  filter: distorting.value ? `url(#${filterId})` : 'none',
}))

/** Static values that hold when nothing is animating — the frozen frame. */
function frozenValues(): { scale: number; shift: number } {
  const strength = unit.value * level.value
  // 0.7 is not a demo-friendly exaggeration: it is the smallest warp that still
  // reads as "this signal is not stable" at a glance on a machine where the
  // ripple itself never moves.
  return { scale: strength * 0.7, shift: strength * 2.2 }
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
 * binds the same two values, so if Vue ever re-renders (a class flip on hover, a
 * prop change) the patch replays the *current* numbers instead of resetting the
 * filter to its initial state. Writing only the DOM node would be cheaper and
 * would also work — until the first re-render silently undid it.
 */
function paint(scale: number, shift: number): void {
  const roundedScale = Math.round(scale * 100) / 100
  const roundedShift = Math.round(shift * 10) / 10

  fieldScale.value = roundedScale
  fieldShift.value = roundedShift

  const map = mapEl.value
  const noise = noiseEl.value
  if (map) map.setAttribute('scale', String(roundedScale))
  if (noise) noise.setAttribute('dy', String(roundedShift))
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
  const phase = (t % c) / c

  // Breathing amplitude: the signal is never quite steady.
  const breath = 0.78 + 0.34 * Math.sin((t / (c * 0.5)) * Math.PI * 2)

  // One hard cut per cycle: a 90ms slice where the field jolts. Without it this
  // is a water ripple; with it, it is a *broken* signal.
  const cut = phase > 0.71 && phase < 0.755 ? 1.95 : 1

  // The shift never wraps: turbulence is not periodic, so any modulo would show
  // up as a jump. Six digits of pixels is ~20 minutes of travel.
  const shift = (t * strength * 3.4) % 1_000_000

  paint(strength * breath * cut, shift)
}

function stop(): void {
  if (raf) {
    window.cancelAnimationFrame(raf)
    raf = 0
  }
}

function freeze(): void {
  const { scale, shift } = frozenValues()
  paint(scale, shift)
}

function sync(): void {
  if (!distorting.value) {
    stop()
    paint(0, 0)
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
          <feOffset ref="noiseEl" in="centered" dx="0" :dy="fieldShift" result="shifted" />
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
