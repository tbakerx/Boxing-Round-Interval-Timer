import { observable, action } from 'mobx'

class TimerStore {
  @observable title
  @observable numRounds
  @observable duration
  @observable rest
  @observable currTimerVal
  @observable currRound
  @observable isRunning

  constructor() {
    this.title = 'Classic'
    this.numRounds = 12
    this.currRound = 1
    this.duration = 180
    this.rest = 60
    this.currTimerVal = this.duration
    this.isRunning = false
    this.isBreak = false
  }

  @action loadProfile = (profile) => {
    this.title = profile.title
    this.numRounds = profile.numRounds
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
    this.isBreak = false
    this.currRound++
    this.duration = this.duration
  }

  @action runBreak = () => {
    this.isBreak = true
  }

  @action resetStore = () => {
    this.currRound = 1
    this.isRunning = false
    this.isBreak = false
  }
}

export default TimerStore
