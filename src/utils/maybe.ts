type ApplyFunction<T> = <RT>(f: (value: T) => RT) => RT | null

type Maybe<T> = {
  apply: ApplyFunction<T>
  pipe: <RT>(f: (value: T) => RT) => Maybe<RT>
}

const apply = <T>(x: T | null | undefined) => <RT>(f: (value: T) => RT, fallback?: RT) =>
  x ? f(x) : fallback ?? null

export const maybe = <T>(x: T | null | undefined): Maybe<T> => ({
  apply: apply(x),
  pipe: <RT>(f: (value: T) => RT) => maybe<RT>(apply(x)(f)),
})
