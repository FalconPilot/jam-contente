export const encodeData = <T extends object>(data: T) =>
  btoa(encodeURIComponent(JSON.stringify(data)))

export const decodeData = <T extends object>(decoder: (x: unknown) => T) => (data: string) =>
  decoder(JSON.parse(decodeURIComponent(atob(data))))

export const saveData = <T extends object>(key: string, data: T) => {
  localStorage.setItem(key, encodeData(data))
}

export const loadData = <T extends object>(key: string, decoder: (x: unknown) => T) => {
  const rawData = localStorage.getItem(key)

  if (rawData) {
    return decodeData(decoder)(rawData)
  }
}
