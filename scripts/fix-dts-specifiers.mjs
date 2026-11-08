#!/usr/bin/env node
/**
 * Emitted declarations keep extensionless relative specifiers ("./components/button")
 * plus side-effect style imports ("import './styles/index.scss'"). Both are wrong for a
 * published ESM package: TypeScript's node16 / nodenext resolution rejects extensionless
 * relative imports (TS2834) and the .scss files are not shipped in dist at all.
 *
 * This runs right after `vue-tsc --emitDeclarationOnly` and:
 *   1. drops side-effect imports of stylesheets that have no declaration counterpart;
 *   2. rewrites every relative specifier to the explicit path it resolves to
 *      ("./components/button" -> "./components/button/index.js", "./types" -> "./types.js"),
 *      which both `bundler` and `node16` module resolution accept.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROOT = 'dist/types'
const STYLE_SIDE_EFFECT = /^[ \t]*import\s+(['"])(\.{1,2}\/[^'"]+\.(?:scss|sass|css))\1;?[ \t]*\r?\n/gm
const RELATIVE_SPECIFIER = /(from\s*|import\s*\(\s*)(['"])(\.{1,2}\/[^'"]+)\2/g

/** @type {string[]} */
const files = []
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.d.ts')) files.push(p)
  }
})(ROOT)

let dropped = 0
let rewritten = 0
/** @type {string[]} */
const unresolved = []

for (const file of files) {
  const dir = dirname(file)
  const before = readFileSync(file, 'utf8')
  let source = before.replace(STYLE_SIDE_EFFECT, () => {
    dropped += 1
    return ''
  })

  source = source.replace(RELATIVE_SPECIFIER, (match, lead, quote, spec) => {
    const base = resolve(dir, spec)
    if (existsSync(`${base}.d.ts`)) {
      rewritten += 1
      return `${lead}${quote}${spec}.js${quote}`
    }
    if (existsSync(join(base, 'index.d.ts'))) {
      rewritten += 1
      return `${lead}${quote}${spec}/index.js${quote}`
    }
    unresolved.push(`${file}: ${spec}`)
    return match
  })

  if (source !== before) writeFileSync(file, source)
}

console.log(`[fix-dts] ${files.length} declaration files · ${rewritten} specifiers rewritten · ${dropped} style imports dropped`)
if (unresolved.length > 0) {
  console.error('[fix-dts] unresolved relative specifiers:')
  for (const line of unresolved) console.error(`  - ${line}`)
  process.exitCode = 1
}
