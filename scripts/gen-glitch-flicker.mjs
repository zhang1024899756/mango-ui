/**
 * Regenerates the `@keyframes myui-gr-flicker` block in
 * src/effects/glitch-ripple/styles/glitch-ripple.scss.
 *
 *     node scripts/gen-glitch-flicker.mjs           # rewrite the block
 *     node scripts/gen-glitch-flicker.mjs --dry-run # print the table only
 *
 * WHY THIS EXISTS
 * The flicker has to look like a failing feed, not a metronome. That is a
 * property of the *numbers*, and numbers that are hand-typed drift: the first
 * version of this effect was three evenly-spaced dips, which is a rhythm you can
 * count. So the track is drawn from a seeded PRNG instead, and this script
 * refuses to write anything until the table passes the checks that make the
 * result usable:
 *
 *   - every gap ≥ 700ms — the flash-rate ceiling (≤ 3 flashes/sec; the
 *     stylesheet's fastest speed scales the track by 13600/19200, giving 2/s);
 *   - no three gaps within 80ms of each other — three equal beats is a pulse;
 *   - no four or more gaps alternating short/long — that is a beat even when
 *     every number differs;
 *   - every dip ≥ 0.55 opacity — the text has to stay readable at its worst;
 *   - no two consecutive dips at the same depth — that reads as a blink;
 *   - no dip overlaps the next, and none runs past the end of the track.
 *
 * The seed is fixed, so the shipped CSS is reproducible and reviewable: change
 * FIRST_SEED, re-run, and read the printed table before committing.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const TARGET = fileURLToPath(
  new URL('../src/effects/glitch-ripple/styles/glitch-ripple.scss', import.meta.url),
)
const TRACK_MS = 19200
const COUNT = 16
const MIN_GAP = 700
const MIN_DIP_OPACITY = 0.55
const FIRST_SEED = 20261109
const SEED_SEARCH_WINDOW = 5000

/** mulberry32 — small seeded PRNG; enough for a few hundred draws. */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function build(seed) {
  const rand = rng(seed)

  /* Gaps: COUNT + 1 of them describe a full cycle — the last is the wrap from the
   * final dip back to the first. Only the slack above the floors is distributed,
   * so no arithmetic slip can produce an illegal gap. */
  const gapCount = COUNT + 1
  const slackBudget = TRACK_MS - gapCount * MIN_GAP
  const raw = Array.from({ length: gapCount }, () => rand() ** 1.4)
  const rawSum = raw.reduce((a, b) => a + b, 0)
  const gaps = raw.map((r) => MIN_GAP + Math.round(((r / rawSum) * slackBudget) / 10) * 10)
  gaps[Math.floor(rand() * gapCount)] += TRACK_MS - gaps.reduce((a, b) => a + b, 0)

  /* Positions are the cumulative sum of the gaps *before* each dip, so the first
   * dip lands a gap into the track (never at 0%) and the last one clears the end
   * by at least the wrap gap. */
  const starts = []
  let cursor = 0
  for (let i = 0; i < COUNT; i++) {
    cursor += gaps[i]
    starts.push(cursor)
  }

  const lengths = starts.map(() => 70 + Math.round(rand() * 80))

  const depths = []
  for (let i = 0; i < COUNT; i++) {
    let d = Math.round((MIN_DIP_OPACITY + rand() * 0.33) * 100) / 100
    if (i && Math.abs(d - depths[i - 1]) < 0.04) d = Math.round((d + 0.05) * 100) / 100
    depths.push(Math.min(0.88, d))
  }

  return { gaps, starts, lengths, depths }
}

/** Everything the stylesheet's comment claims, checked rather than believed. */
function failures({ gaps, starts, lengths, depths }) {
  const out = []
  const wrapGap = TRACK_MS - starts.at(-1) + starts[0]
  const minGap = Math.min(...gaps, wrapGap)
  if (minGap < MIN_GAP) out.push(`min gap ${minGap}ms < ${MIN_GAP}ms`)

  for (let i = 0; i < starts.length; i++) {
    if (i > 0 && starts[i] < starts[i - 1] + lengths[i - 1]) out.push(`dip ${i} overlaps the previous one`)
    if (starts[i] + lengths[i] > TRACK_MS) out.push(`dip ${i} runs past the end of the track`)
  }

  for (let i = 0; i < gaps.length; i++) {
    const window = [gaps[i], gaps[(i + 1) % gaps.length], gaps[(i + 2) % gaps.length]]
    if (Math.max(...window) - Math.min(...window) < 80) {
      out.push(`three near-equal gaps in a row from index ${i}: ${window.join('/')}`)
      break
    }
  }

  const median = [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)]
  const pattern = gaps.map((g) => (g < median ? 's' : 'L')).join('')
  let run = 1
  let longest = 1
  for (let i = 1; i < pattern.length; i++) {
    run = pattern[i] === pattern[i - 1] ? 1 : run + 1
    longest = Math.max(longest, run)
  }
  if (longest >= 5) out.push(`gaps alternate for ${longest} in a row: ${pattern}`)

  if (Math.min(...depths) < MIN_DIP_OPACITY) out.push(`a dip goes below ${MIN_DIP_OPACITY}`)
  for (let i = 1; i < depths.length; i++) {
    if (depths[i] === depths[i - 1]) out.push(`dips ${i - 1} and ${i} share a depth`)
  }
  return out
}

let seed = FIRST_SEED
let table = null
for (; seed < FIRST_SEED + SEED_SEARCH_WINDOW; seed++) {
  const candidate = build(seed)
  if (failures(candidate).length === 0) {
    table = candidate
    break
  }
}
if (!table) throw new Error(`no seed in ${SEED_SEARCH_WINDOW} produced a legal table`)

const { gaps, starts, lengths, depths } = table
const wrapGap = TRACK_MS - starts.at(-1) + starts[0]
const minGap = Math.min(...gaps.slice(0, COUNT), wrapGap)
const fastScale = 13600 / TRACK_MS

console.log(`seed ${seed} · ${COUNT} dips over ${TRACK_MS}ms`)
console.log(`gaps      ${gaps.slice(0, COUNT).join(', ')} (wrap ${wrapGap})`)
console.log(`min gap   ${minGap}ms → ≤ ${(1000 / minGap).toFixed(2)} flashes/s here, ` +
  `≤ ${(1000 / (minGap * fastScale)).toFixed(2)}/s at --fast`)
console.log(`depths    ${depths.join(', ')} (min ${Math.min(...depths)})`)
console.log(`mean rate ${(COUNT / (TRACK_MS / 1000)).toFixed(2)} dips/s`)

/* ---- emit ---------------------------------------------------------------- */

const dips = starts.map((s, i) => [s, lengths[i], depths[i]])
const pct = (ms) => `${Math.round((ms / TRACK_MS) * 10000) / 100}%`

const events = [{ p: '0%', o: 1 }]
for (const [start, len, o] of dips) {
  events.push({ p: pct(start), o })
  events.push({ p: pct(start + len), o: 1 })
}
events.push({ p: '100%', o: 1 })

const full = [...new Set(events.filter((e) => e.o === 1).map((e) => e.p))]
const drops = events.filter((e) => e.o !== 1)

const lines = ['@keyframes myui-gr-flicker {']
full.forEach((p, i) => lines.push(`  ${p}${i === full.length - 1 ? ' {' : ','}`))
lines.push('    opacity: 1;', '  }')
for (const d of drops) lines.push('', `  ${d.p} {`, `    opacity: ${d.o};`, '  }')
lines.push('}')
const block = lines.join('\n')

if (process.argv.includes('--dry-run')) {
  console.log('\n--- would write ---\n' + block)
  process.exit(0)
}

const source = readFileSync(TARGET, 'utf8')
const start = source.indexOf('@keyframes myui-gr-flicker {')
if (start < 0) throw new Error(`no @keyframes myui-gr-flicker in ${TARGET}`)
const end = source.indexOf('\n}\n', start) + 3
writeFileSync(TARGET, source.slice(0, start) + block + '\n' + source.slice(end))
console.log(`\nwrote ${block.length} bytes into ${TARGET}`)
