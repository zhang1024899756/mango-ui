# Mango UI — component conventions

Read this before adding a component. Every rule here exists because breaking it
has already cost someone a review cycle: the goal is that any component in this
repo is indistinguishable in *structure* from `src/components/button`, which is
the reference implementation.

---

## 1. The one non-negotiable: design direction

Mango UI is a **trend / culture / streetwear portal** library. Look at the hero
of the docs site before you write CSS.

- Warm paper background, ink-black text, **one** hot vermilion accent
  (`--myui-color-accent: #ff4d1a`).
- Borders are **hard** (`--myui-border-width: 2px`, `--myui-color-line`).
- Shadows are **hard offset, never blurred** (`--myui-shadow-glow`).
- Radius is **0** by default; `--myui-radius-pill` only for pills (tags, switch,
  slider thumb, avatars).
- Display type is heavy and tight (`--myui-font-display`, `--myui-leading-tight`,
  `--myui-tracking-tight`).

**This is explicitly NOT an admin dashboard.** No soft 8px radii, no blurred
`box-shadow`, no blue-grey `#f5f7fa` panels, no `0 2px 8px rgba(0,0,0,.06)`
elevation, no 4-col stat cards with an icon in a rounded square. If it looks like
an internal tool, it is wrong.

Rules that follow from that:

1. **Every colour, space, radius, font size, glow and duration comes from a CSS
   custom property in `src/styles/tokens.scss`.** No literal hex, no `padding: 14px`,
   no `border-radius: 8px`, no `box-shadow: 0 1px 3px rgba(...)`.
   Grep your own file for `#`, `px` and `rgba(` before you finish: the only allowed
   literals are `0`, `1px`-scale hairlines, `100%`, and values you cannot tokenise.
2. The accent is for **the primary action and nothing decorative**. If an element
   is not actionable and not selected, it is not accent-coloured.
3. Never add a colour that is not in the token file. If you truly need one, ask
   the lead — do not invent a third neon (`#7c5cff` and violet gradients are how
   cyberpunk turns into slop).

---

## 2. Folder layout

```
src/components/<name>/          src/effects/<name>/
├── <Name>.vue                  ├── <Name>.vue
├── types.ts                    ├── types.ts
├── index.ts                    ├── index.ts
├── styles/<name>.scss          ├── styles/<name>.scss
├── <Name>.stories.ts           ├── <Name>.stories.ts
└── <Name>.test.ts              └── <Name>.test.ts
docs/components/<name>.md
```

- Component tag and exported name: `Myui<Name>` (`MyuiButton`, `MyuiSlider`).
- CSS prefix: `.myui-<name>`; elements `.myui-<name>__part`; modifiers
  `.myui-<name>--<modifier>`.
- `<Name>.vue` must declare `defineOptions({ name: 'Myui<Name>' })`.

`index.ts` is always this shape:

```ts
import './styles/<name>.scss'
import <Name> from './<Name>.vue'
import { withInstall } from '../../utils/with-install'

export const Myui<Name> = withInstall(<Name>, 'Myui<Name>')
export type { <Name>Props /* … */ } from './types'
export default Myui<Name>
```

**Do not edit `src/index.ts`** — the lead wires the exports.

---

## 3. Component contract (`<Name>.vue`)

- `<script setup lang="ts">`, props declared as an interface in `types.ts`, applied
  with `withDefaults(defineProps<Props>(), {...})`. Export every union type.
- `defineEmits<{ (e: 'x', payload: T): void }>()` — named, typed events only.
- No `<style scoped>`. Styles live in `styles/<name>.scss` and are imported once
  by `index.ts`. Scoped attributes make user overrides harder; our namespaced
  classes already prevent leaking.
- Every interactive element gets `@include myui-focus-ring;` (from
  `@use '../../../styles/mixins.scss' as *;`).
- Every animation/transition must be neutralised under
  `@include myui-motion-safe { … }`, or have a reduced-motion alternative.
- Prefer native semantics: `<button>`, `<input type=checkbox>`, `<a>`. A `div`
  with `@click` is a bug, not a shortcut.

### Accessibility floor (all of these are tested)

| Component kind | Requirement |
| --- | --- |
| Clickable | `<button>`/`<a>` element, keyboard operable, visible focus |
| Toggle (`Switch`) | `role="switch"`, `aria-checked`, `<button>` base, Space/Enter |
| Range (`Slider`) | `role="slider"`, `aria-valuenow/min/max`, arrow-key support |
| Overlay (`Dialog`) | `role="dialog"`, `aria-modal`, labelled by title, Escape closes, focus trapped and restored |
| Icon-only | `aria-label` prop, `aria-hidden` when decorative |
| Motion | Respects `prefers-reduced-motion` |
| Text | Contrast ≥ 4.5:1 on its own background (large display text ≥ 3:1) |

Disabled states use `disabled` where the native element allows it, otherwise
`aria-disabled="true"` plus blocked events — never a greyed style with no
behavioural change.

---

## 4. Styles (`styles/<name>.scss`)

Start with the mixins import — the path depth is always three levels up:

```scss
@use '../../../styles/mixins.scss' as *;
```

Available mixins: `myui-focus-ring`, `myui-focus-ring-inset`, `myui-control-reset`,
`myui-hard-press`, `myui-truncate`, `myui-line-clamp`, `myui-visually-hidden`,
`myui-motion-safe`, `myui-eyebrow`.

Do **not** `@use` tokens.scss — tokens are emitted once globally; importing them
per component would duplicate the `:root` block into every CSS file.

Useful tokens (full list in `src/styles/tokens.scss`):

| Purpose | Token |
| --- | --- |
| Surfaces | `--myui-color-bg`, `--myui-color-surface`, `--myui-color-surface-raised`, `--myui-color-surface-deep` |
| Text | `--myui-color-text`, `--myui-color-text-soft`, `--myui-color-text-faint` |
| Lines | `--myui-color-line`, `--myui-color-line-soft`, `--myui-color-line-strong`, `--myui-color-grid` |
| Accent | `--myui-color-accent`, `-hover`, `-active`, `-ink`, `-text`, `-wash` |
| Signal | `--myui-color-signal`, `-text`, `-wash` |
| State | `--myui-color-success/warning/danger/info` (+ `-wash`) |
| Type | `--myui-text-xs … --myui-text-3xl`, `--myui-leading-*`, `--myui-weight-*` |
| Space | `--myui-space-1 … --myui-space-8` (4 → 64) |
| Shape | `--myui-radius-none`, `--myui-radius-pill`, `--myui-border-width` |
| Shadow | `--myui-shadow-glow-sm/-hard/-hard-lg` |
| Size | `--myui-control-sm/md/lg` |
| Motion | `--myui-duration-fast/-/-slow`, `--myui-ease-snap`, `--myui-ease-out` |

---

## 5. Stories (`<Name>.stories.ts`)

CSF3 with `satisfies Meta<typeof Myui<Name>>`:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Myui<Name> } from './index'

const meta = {
  title: 'Elements/<Name>',        // 'Effects/<Name>' for effects
  component: Myui<Name>,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'One paragraph: what problem it solves and what the house style imposes.' } } },
  argTypes: { /* controls */ },
  args: { /* defaults */ },
} satisfies Meta<typeof Myui<Name>>

export default meta
type Story = StoryObj<typeof meta>
```

Requirements: at least one story per variant, one per size, one per meaningful
state (disabled/loading/error/empty). Render functions return
`{ components, setup, template }` — see `Button.stories.ts`. Stories are the
acceptance surface: if a state is not in a story, it is not verified.

---

## 6. Tests (`<Name>.test.ts`)

`vitest` + `@vue/test-utils`, explicit imports (`import { describe, expect, it } from 'vitest'`),
no globals, no snapshots. Import the `.vue` file directly.

Cover: render output, every prop → class/attribute mapping, event emission,
blocked interaction when disabled, keyboard behaviour, accessibility attributes,
and slot rendering where applicable. Target 6–10 focused assertions per
component; a test that only asserts `toBeDefined()` is not a test (that is what
the old repo had, and it is why nobody trusted it).

---

## 7. Docs page (`docs/components/<name>.md`)

The sidebar entry already exists in `docs/.vitepress/config.ts` — just create the
file. Every component is globally registered, so **use tags directly**, no imports.

```md
---
title: Button 按钮
description: 一句话说明。
---

# Button 按钮

一句话说明这个组件解决什么问题。

## 基础用法

::: demo
<MyuiButton>立即抢购</MyuiButton>
:::

```vue
<MyuiButton>立即抢购</MyuiButton>
```

## 变体 / 尺寸 / 状态

…more `::: demo` blocks…

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'solid' \| 'outline'` | `'solid'` | 视觉权重 |

## 插槽 / 事件
…

## 可访问性
一句话说明键盘与语义行为。
```

Rules: Chinese prose, streetwear-poster energy (short sentences, no corporate
padding), every demo must be runnable as written, and the Props table must match
`types.ts` exactly.

---

## 8. Verify before you report done

Run from the repo root:

```bash
pnpm type-check      # vue-tsc, must be clean
pnpm test            # vitest, all green
pnpm build           # vite lib + d.ts, must emit dist/
```

If another teammate is mid-edit, `pnpm test` may show their files — re-run with
your own filter first (`pnpm vitest run src/components/<name>`) and use the full
suite only for the final check.

---

## 9. Do not touch

`src/index.ts`, `src/styles/tokens.scss`, `src/styles/mixins.scss`,
`src/styles/reset.scss`, `src/styles/index.scss`, `docs/.vitepress/**`,
`package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`,
`.storybook/**`, `README.md`, `CONTRIBUTING.md`, and any directory outside your
assigned component scope.
