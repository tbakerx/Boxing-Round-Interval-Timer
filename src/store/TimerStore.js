import { observable, action } from 'mobx'

class TimerStore {
  @observable title
  @observable numRounds
  @observable roundDuration
  @observable restDuration
  @observable currTimerVal
  @observable currRound
  @observable isRunning
  @observable isRest

  constructor() {
    this.title = 'Classic'
    this.numRounds = 12
    this.currRound = 1
    this.roundDuration = 180
    this.restDuration = 60
    this.currTimerVal = this.roundDuration
    this.isRunning = false
    this.isRest = false
  }

  @action loadProfile = (profile) => {
    this.title = profile.title
    this.numRounds = profile.numRounds
    this.roundDuration = profile.roundDuration
    this.restDuration = profile.restDuration
    this.currTimerVal = profile.roundDuration
    this.currRound = 1
    this.isRunning = false
    this.isRest = false
  }

  @action startTimer = () => {}

  @action stopTimer = () => {}

  @action resetTimer = () => {}

  @action incrementRound = () => {
    this.isRest = false
    this.currRound++
    this.roundDuration = this.roundDuration
  }

  @action setRest = () => {
    this.isRest = true
  }

  @action resetTimerStore = () => {
    this.currRound = 1
    this.isRunning = false
    this.isRest = false
  }
}

export default TimerStore
