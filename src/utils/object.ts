export const entries = <O extends object>(o: O) =>
  Object.entries(o) as Array<[keyof O, O[keyof O]]>

export const keys = <O extends object>(o: O) =>
  Object.keys(o) as Array<keyof O>
