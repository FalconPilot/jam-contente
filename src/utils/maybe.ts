type ApplyFunction<T> = <RT>(f: (value: T) => RT) => RT | null

type Maybe<T> = {
  apply: ApplyFunction<T>
  pipe: <RT>(f: (value: T) => RT, fallback?: T) => Maybe<RT>
  verify: (f: (value: T) => boolean, fallback?: T) => T | null
}

const exists = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined

const apply = <T>(x: T | null | undefined) => <RT>(f: (value: T) => RT, fallback?: RT) =>
  exists(x) ? f(x) : fallback ?? null

const verify = <T>(x: T | null | undefined) => (f: (value: T) => boolean, fallback?: T) =>
  exists(x) && f(x) ? x : fallback ?? null

export const maybe = <T>(x: T | null | undefined): Maybe<T> => ({
  apply: apply(x),
  pipe: <RT>(f: (value: T) => RT) => maybe<RT>(apply(x)(f)),
  verify: verify(x),
})
