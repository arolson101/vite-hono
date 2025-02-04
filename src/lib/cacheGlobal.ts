/**
 * Cache a variable (such as a database connection) in development. This avoids creating a new variable on every HMR
 * update.
 */
export function cacheGlobal<T>(key: string, create: () => T, free?: (old: T) => void): T {
  if (free) {
    type ObjT = { value: T; free?: (old: T) => void }
    const global = globalThis as unknown as Record<string, ObjT>
    global[key]?.free?.(global[key].value)
    const value = create()
    global[key] = { value, free }
    return value
  } else {
    const global = globalThis as unknown as Record<string, T>
    global[key] ??= create()
    return global[key]
  }
}
