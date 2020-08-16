import { observable, action } from 'mobx'

class SettingsStore {
  @observable testStore = 'Settings Store'
  constructor() {}
}

export default SettingsStore
