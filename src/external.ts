export type AtLeastOne<T, K extends keyof T = keyof T> = K extends unknown ? { -readonly [key in K]-?: T[key] } : never
