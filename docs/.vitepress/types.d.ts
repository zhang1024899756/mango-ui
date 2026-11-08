/**
 * markdown-it-container v4 is published as ESM without bundled types, and there
 * is no @types package for it. We only use `md.use(container, name, { render })`,
 * so a minimal declaration is enough — it keeps the docs config strictly typed
 * instead of silently falling back to `any`.
 */
declare module 'markdown-it-container' {
  export interface ContainerOptions {
    validate?: (params: string) => boolean
    render?: (tokens: Array<{ nesting: number }>, index: number) => string
    marker?: string
  }

  export type ContainerPlugin = (
    md: unknown,
    name: string,
    options?: ContainerOptions,
  ) => void

  const container: ContainerPlugin
  export default container
}
