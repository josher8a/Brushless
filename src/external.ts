export type AtLeastOne<T, K extends keyof T = keyof T> = K extends unknown ? { [key in K]-?: T[key] } : never
