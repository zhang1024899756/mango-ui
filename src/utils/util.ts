// import type { Hash } from 'vue'

export function entries<T> (obj: any): [string, T][] {
  return Object
    .keys(obj)
    .map((key: string) => ([key, obj[key]]))
}
