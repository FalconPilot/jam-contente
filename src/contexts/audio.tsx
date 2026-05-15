import * as React from 'react'

import { entries } from '../utils'

type AudioOptions = {
  src: string
  volume?: number
  loop?: boolean
}

type AudioState<K extends string> = {
  audio: { [k in K]: HTMLAudioElement }
}

type AudioFunctions = {}

type AudioContextValue<K extends string> = [AudioState<K>, AudioFunctions]

export const generateAudioContext = <K extends string>(audioFiles: { [k in K]: string | AudioOptions }) => {
  const audio = entries(audioFiles).reduce<AudioState<K>['audio']>((acc, [key, entry]) => ({
    ...acc,
    [key]: new Audio(typeof entry === 'string' ? entry : entry.src),
  }), {} as AudioState<K>['audio'])

  const initialState: AudioState<K> = { audio }

  const context = React.createContext<AudioContextValue<K>>([initialState, {}])

  const AudioProvider = ({ children }: { children: React.ReactElement }) => {
    const [state] = React.useState(initialState)

    const contextValue = React.useMemo<AudioContextValue<K>>(() => [state, {}], [state])

    // Handle preload
    React.useEffect(() => {
      entries(state.audio).forEach(([key, elt]) => {
        elt.preload = 'auto'

        const options = audioFiles[key]
        if (typeof options === 'string') return

        elt.loop = options.loop ?? false
        if (typeof options.volume === 'number') {
          elt.volume = Math.max(0, Math.min(100, options.volume))
        }
      })
    }, [])

    return (
      <context.Provider value={contextValue}>
        {children}
      </context.Provider>
    )
  }

  const useAudio = () => React.useContext(context)

  return [AudioProvider, useAudio] as const
}
