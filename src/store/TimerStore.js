import { observable, action } from 'mobx'
import Sound from 'react-native-sound'

class TimerStore {
  @observable title
  @observable numRounds
  @observable roundDuration
  @observable restDuration
  @observable currTimerVal
  @observable currRound
  @observable isRunning
  @observable isRest

  roundEndSound = null
  clackerSound = null

  constructor() {
    this.title = 'Classic'
    this.numRounds = 12
    this.currRound = 1
    this.roundDuration = 180
    this.restDuration = 60
    this.currTimerVal = this.roundDuration
    this.isRunning = false
    this.isRest = false

    this.initializeSounds()
  }

  initializeSounds = () => {
    Sound.setCategory('Playback')

    this.roundEndSound = new Sound(
      'round_end.mp3',
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log('Failed to load sound effect', error)
          return
        } else {
          console.log('Round End sound loaded successfully')
        }
      }
    )

    this.clackerSound = new Sound('clacker.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load sound effect', error)
        return
      } else {
        console.log('Clacker sound loaded successfully')
      }
    })
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

  @action playRoundEnd = () => {
    if (!this.roundEndSound) {
      console.log('Sound not loaded')
    } else {
      this.roundEndSound.play()
    }
  }

  @action playClacker = () => {
    if (!this.clackerSound) {
      console.log('Sound not loaded')
    } else {
      this.clackerSound.play()
    }
  }
}

export default TimerStore
