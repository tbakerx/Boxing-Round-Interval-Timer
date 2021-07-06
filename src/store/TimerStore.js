import { observable, action } from 'mobx'
import Sound from 'react-native-sound'
import bellOne from '../../assets/sounds/bellOne.mp3'
import bellThree from '../../assets/sounds/bellThree.mp3'
import clacker from '../../assets/sounds/clacker.mp3'
import clock from '../../assets/sounds/clock.mp3'

class TimerStore {
  @observable title
  @observable numRounds
  @observable roundDuration
  @observable restDuration
  @observable currTimerVal
  @observable currRound
  @observable isRunning
  @observable isRest
  @observable sound
  @observable video
  @observable countDown
  @observable displayCountDown

  roundEndSound = null
  clackerSound = null

  constructor() {
    this.isInit = true
    this.title = 'BOXING'
    this.numRounds = 12
    this.currRound = 1
    this.roundDuration = 180
    this.restDuration = 60
    this.currTimerVal = this.roundDuration
    this.isRunning = false
    this.isRest = false
    this.sound = true
    this.video = true
    this.countDown = false
    this.displayCountDown = false
    this.initializeSounds()
  }

  initializeSounds = () => {
    // Sound.setCategory('Playback')
    // Sound.setCategory('PlayAndRecord', true)
    Sound.setCategory('Ambient', true)
    Sound.setActive(true)
    this.roundStartSound = new Sound(bellOne)
    this.roundEndSound = new Sound(bellThree)
    this.clackerSound = new Sound(clacker)
    this.clockSound = new Sound(clock)
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

  @action startTimer = () => {
    if (this.isInit) {
      this.playRoundStart()
    }
    this.isInit = false
    this.isRunning = true
  }

  @action pauseTimer = () => {
    this.isRunning = false
  }

  @action resetTimer = () => {
    this.isInit = true
    this.currRound = 1
    this.isRunning = false
    this.isRest = false
    this.roundStartSound.stop()
    this.roundEndSound.stop()
    this.clackerSound.stop()
    this.clockSound.stop()
  }

  @action incrementRound = () => {
    this.isRest = false
    this.currRound++
    this.roundDuration = this.roundDuration
    this.playRoundStart()
  }

  @action setRest = () => {
    this.isRest = true
  }

  @action setTimer = (rounds, count, rest) => {
    this.numRounds = rounds
    this.roundDuration = count
    this.restDuration = rest
    this.resetTimer()
  }

  @action setSound = val => {
    this.sound = val
  }

  @action setVideo = val => {
    this.video = val
  }

  @action setCountDown = val => {
    this.countDown = val
  }

  @action toggleSound = () => {
    this.sound = !this.sound
  }

  @action toggleVideo = () => {
    this.video = !this.video
  }

  @action toggleCountDown = () => {
    this.countDown = !this.countDown
  }

  @action setDisplayCountDown = val => {
    this.displayCountDown = val
  }

  @action playRoundStart = () => {
    if (this.sound) {
      if (!this.roundStartSound) {
        console.log('Sound not loaded')
      } else {
        this.roundStartSound.play()
      }
    }
  }

  @action playRoundEnd = () => {
    if (this.sound && !this.isRest) {      
      if (!this.roundEndSound) {
        console.log('Sound not loaded')
      } else {
        this.roundEndSound.play()
      }
    }
  }

  @action playClacker = () => {
    if (this.sound && !this.isRest) {      
      if (!this.clackerSound) {
        console.log('Sound not loaded')
      } else {
        this.clackerSound.play()
      }
    }
  }

  @action playClock = () => {
    if (this.sound) {      
      if (!this.clockSound) {
        console.log('Sound not loaded')
      } else {
        this.clockSound.play()
      }
    }
  }

  _currentState = () => {
    return {
      title: this.title,
      numRounds: this.numRounds,
      roundDuration: this.roundDuration,
      restDuration: this.restDuration,
      currTimerVal: this.currTimerVal,
      currRound: this.currRound,
      isRunning: this.isRunning,
      isRest: this.isRest,
    }
  }
}

export default TimerStore
