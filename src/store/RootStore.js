import React from 'react'
import SettingsStore from './SettingsStore'
import TimerStore from './TimerStore'

export class RootStore {
  settingsStore = new SettingsStore()
  timerStore = new TimerStore()
}

const initializedStores = new RootStore()

export const storesContext = React.createContext(initializedStores)
