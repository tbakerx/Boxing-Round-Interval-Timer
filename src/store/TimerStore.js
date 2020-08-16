import { observable, action } from 'mobx'

class TimerStore {
  @observable testStore = 'Timer Store'
  constructor() {}
}

export default TimerStore
