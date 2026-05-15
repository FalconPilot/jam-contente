import * as React from 'react'

import { loadData, saveData } from '../utils'

type GameDataFunctions<T extends object> = {
  updateGameData: (arg: Partial<T> | ((prev: T) => Partial<T>), save: boolean, storageKey?: string) => void
  saveGameData: (key?: string) => void
  loadGameData: (key?: string) => void
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
  autosaveByDefault?: boolean
}

export const generateGameDataContext = <T extends object>({
  initialState,
  decoder,
  localStorageKey,
  autosaveByDefault = false,
}: GameDataOptions<T>) => {
  const context = gameDataContext(initialState)

  const GameDataProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, setState] = React.useState(initialState)

    // Trigger GameData save
    const saveGameData = React.useCallback((key = localStorageKey) => {
      saveData(key, state)
    }, [state])

    // Save a specific set of GameData
    const saveSpecificData = React.useCallback((data: T, key = localStorageKey) => {
      saveData(key, data)
    }, [localStorageKey])

    // Trigger GameData Load
    const loadGameData = React.useCallback((key = localStorageKey) => {
      loadData(key, decoder)
    }, [decoder, localStorageKey])

    // Update GameData with Partial or a function
    const updateGameData = React.useCallback<GameDataFunctions<T>['updateGameData']>((arg, save = autosaveByDefault, storageKey = localStorageKey) => {
      setState(prev => {
        const newState = {
          ...prev,
          ...(typeof arg === 'function' ? arg(prev) : arg),
        }

        if (save) {
          saveSpecificData(newState, storageKey)
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
