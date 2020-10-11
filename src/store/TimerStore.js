import { observable, action } from 'mobx'

class TimerStore {
  @observable title
  @observable numberRounds
  @observable duration
  @observable rest
  @observable currTimerVal
  @observable currRound
  @observable isRunning

  constructor() {
    this.title = 'Default'
    this.numberRounds = 12
    this.currRound = 1
    this.duration = 180
    this.rest = 60
    this.currTimerVal = this.duration
    this.isRunning = false
  }

  @action loadProfile = (profile) => {
    this.title = profile.title
    this.numberRounds = profile.numberRounds
    this.duration = profile.duration
    this.rest = profile.rest
    this.currTimerVal = profile.duration
    this.currRound = 1
    this.isRunning = false
  }

  @action startTimer = () => {}

  @action stopTimer = () => {}

  @action resetTimer = () => {}

  @action incrementRound = () => {
    this.currRound++
  }
}

export default TimerStore
