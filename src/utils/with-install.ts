import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

/**
 * Attach an `install` method so the component can be registered globally:
 *
 * ```ts
 * app.use(MyuiButton)
 * ```
 *
 * The name registered in the app is the explicit `name` argument when given,
 * otherwise the component's own `name` (from `defineOptions`).
 */
export function withInstall<T>(component: T, name?: string): SFCWithInstall<T> {
  const target = component as T & Plugin & { name?: string }

  target.install = (app: App): void => {
    const registered = name ?? target.name
    if (registered) {
      app.component(registered, target)
    }
  }

  return target
}
