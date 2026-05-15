type Maybe<T> = {
  apply: <RT>(f: (value: T) => RT, fallback?: RT) => Maybe<RT>
  verify: (f: (value: T) => boolean, fallback?: T) => Maybe<T>
  unless: (f: (value: T) => boolean, fallback?: T) => Maybe<T>
  value: T | null
}

const exists = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined

const apply = <T>(x: T | null | undefined) => <RT>(f: (value: T) => RT, fallback?: RT) =>
  maybe(exists(x) ? f(x) : fallback ?? null)

const verify = <T>(x: T | null | undefined) => (f: (value: T) => boolean, fallback?: T) =>
  maybe(exists(x) && f(x) ? x : fallback ?? null)

const unless = <T>(x: T | null | undefined) => (f: (value: T) => boolean, fallback?: T) =>
  maybe(exists(x) && !f(x) ? x : fallback ?? null)

export const maybe = <T>(x: T | null | undefined): Maybe<T> => ({
  apply: apply(x),
  verify: verify(x),
  unless: unless(x),
  value: x ?? null,
})
