/* =============================================================================
 * Mango UI — icon path data
 * -----------------------------------------------------------------------------
 * Hand-drawn on a 24×24 grid, one stroke style: no fills, round caps and joins,
 * a single stroke weight supplied by the component. Optical box is roughly
 * 4→20 so every glyph reads at the same size next to its neighbours; shapes
 * that must be big (star, gear, warning) stop at 3.4→20.6 for the same reason.
 *
 * Geometric rules of the set:
 *   - straight strokes land on whole or half units
 *   - corners are Q curves with a 1.5–2.5 unit radius, never `a` flags that are
 *     easy to get wrong, never a filled shape
 *   - circles are written with the two-arc idiom, diameter vertical
 *
 * Every icon is an array of `d` strings; one <path> per entry. Add an icon by
 * adding a key — `IconName` derives from this map, so nothing else changes.
 * ========================================================================== */

export const ICONS = {
  /* --- arrows ------------------------------------------------------------- */
  'arrow-right': ['M5 12h14', 'M12 5l7 7-7 7'],
  'arrow-left': ['M19 12H5', 'M12 5l-7 7 7 7'],
  'arrow-up': ['M12 19V5', 'M5 12l7-7 7 7'],
  'arrow-down': ['M12 5v14', 'M5 12l7 7 7-7'],

  /* --- chevrons ----------------------------------------------------------- */
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-up': ['M6 15l6-6 6 6'],
  'chevron-left': ['M15 18l-6-6 6-6'],
  'chevron-right': ['M9 6l6 6-6 6'],

  /* --- controls ----------------------------------------------------------- */
  close: ['M6 6l12 12', 'M18 6L6 18'],
  check: ['M4.5 12.5l5 5L20 7'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],

  /* --- action ------------------------------------------------------------- */
  search: ['M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13Z', 'M15.2 15.2L20 20'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  'external-link': [
    'M11 5H6.5Q4 5 4 7.5v10Q4 20 6.5 20h10q2.5 0 2.5-2.5V13',
    'M14 4h6v6',
    'M20 4l-7.5 7.5',
  ],
  copy: [
    'M6.5 6.5h9q2 0 2 2v9q0 2-2 2h-9q-2 0-2-2v-9q0-2 2-2Z',
    'M9 6.5V5q0-1.5 1.5-1.5H19q1.5 0 1.5 1.5v8.5q0 1.5-1.5 1.5h-1.5',
  ],
  trash: [
    'M4 6.5h16',
    'M9.5 6.5V5q0-1.5 1.5-1.5h2q1.5 0 1.5 1.5v1.5',
    'M6.5 6.5l.9 12.6q.1 1.7 1.8 1.7h5.6q1.7 0 1.8-1.7l.9-12.6',
    'M10.3 10.5v6.2',
    'M13.7 10.5v6.2',
  ],

  /* --- system ------------------------------------------------------------- */
  settings: [
    'M21.16 10.39L21.16 13.61L18.09 13.98L16.76 16.28L17.98 19.12L15.18 20.74L13.33 18.26L10.67 18.26L8.82 20.74L6.02 19.12L7.24 16.28L5.91 13.98L2.84 13.61L2.84 10.39L5.91 10.02L7.24 7.72L6.02 4.88L8.82 3.26L10.67 5.74L13.33 5.74L15.18 3.26L17.98 4.88L16.76 7.72L18.09 10.02Z',
    'M12 8.9a3.1 3.1 0 1 0 0 6.2a3.1 3.1 0 1 0 0-6.2Z',
  ],
  user: [
    'M12 4.5a3.7 3.7 0 1 0 0 7.4a3.7 3.7 0 1 0 0-7.4Z',
    'M4.5 20.5a7.5 7.5 0 0 1 15 0',
  ],
  mail: [
    'M6 5.5h12q2.5 0 2.5 2.5v8q0 2.5-2.5 2.5H6q-2.5 0-2.5-2.5V8q0-2.5 2.5-2.5Z',
    'M4 7.6l6.9 5.4q1.1.9 2.2 0l6.9-5.4',
  ],
  lock: [
    'M6.5 10.5h11q1.5 0 1.5 1.5v7q0 1.5-1.5 1.5h-11q-1.5 0-1.5-1.5v-7q0-1.5 1.5-1.5Z',
    'M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5',
  ],
  info: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'M12 11.2V16', 'M12 7.9h.01'],
  warning: ['M12 4.2L20.6 19.5H3.4Z', 'M12 10v4', 'M12 17.2h.01'],

  /* --- expressive --------------------------------------------------------- */
  star: [
    'M12 4.35L13.89 10.15L19.99 10.15L15.05 13.74L16.94 19.55L12 15.96L7.06 19.55L8.95 13.74L4.01 10.15L10.11 10.15Z',
  ],
  heart: [
    'M12 20.4C12 20.4 3.6 15.2 3.6 9.9C3.6 7.2 5.7 5.1 8.4 5.1C10.2 5.1 11.4 6.1 12 7.2C12.6 6.1 13.8 5.1 15.6 5.1C18.3 5.1 20.4 7.2 20.4 9.9C20.4 15.2 12 20.4 12 20.4Z',
  ],
  play: ['M8.5 5.5v13L18.5 12Z'],
  pause: ['M9 5.5v13', 'M15 5.5v13'],
  sparkle: [
    'M12 3.2c.6 4.6 4.2 8.2 8.8 8.8-4.6.6-8.2 4.2-8.8 8.8-.6-4.6-4.2-8.2-8.8-8.8 4.6-.6 8.2-4.2 8.8-8.8Z',
  ],
} as const satisfies Record<string, readonly string[]>

/** The union of every built-in glyph name. */
export type IconName = keyof typeof ICONS

/** Every built-in name, in declaration order — for pickers and galleries. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[]
