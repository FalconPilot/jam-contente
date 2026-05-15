import * as React from 'react'

import { loadData, saveData } from '../utils'

type GameDataFunctions<T extends object> = {
  updateGameData: (arg: Partial<T> | ((prev: T) => Partial<T>), save: boolean) => void
  saveGameData: () => void
  loadGameData: () => void
}

type GameDataContextValue<T extends object> = [T, GameDataFunctions<T>]

const gameDataContext = <T extends object>(initialState: T) => React.createContext<GameDataContextValue<T>>([initialState, {
  updateGameData: () => {},
  saveGameData: () => {},
  loadGameData: () => {},
}])

type GameDataOptions<T extends object> = {
  initialState: T
  decoder: (x: unknown) => T
  localStorageKey: string
}

export const generateGameDataContext = <T extends object>({
  initialState,
  decoder,
  localStorageKey,
}: GameDataOptions<T>) => {
  const context = gameDataContext(initialState)

  const GameDataProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, setState] = React.useState(initialState)

    // Trigger GameData save
    const saveGameData = React.useCallback(() => {
      saveData(localStorageKey, state)
    }, [state])

    // Save a specific set of GameData
    const saveSpecificData = React.useCallback((data: T) => {
      saveData(localStorageKey, data)
    }, [])

    // Trigger GameData Load
    const loadGameData = React.useCallback(() => {
      loadData(localStorageKey, decoder)
    }, [decoder])

    // Update GameData with Partial or a function
    const updateGameData = React.useCallback<GameDataFunctions<T>['updateGameData']>((arg, save = true) => {
      setState(prev => {
        const newState = {
          ...prev,
          ...(typeof arg === 'function' ? arg(prev) : arg),
        }

        if (save) {
          saveSpecificData(newState)
        }

        return newState
      })
    }, [setState, saveSpecificData])

    // Assemble context value
    const ctxValue = React.useMemo<GameDataContextValue<T>>(() => [
      state,
      {
        updateGameData,
        saveGameData,
        loadGameData,
      },
    ], [
      state,
      updateGameData,
      saveGameData,
      loadGameData,
    ])

    return (
      <context.Provider value={ctxValue}>
        {children}
      </context.Provider>
    )
  }

  const useGameData = () => React.useContext(context)
  return [GameDataProvider, useGameData] as const
}
