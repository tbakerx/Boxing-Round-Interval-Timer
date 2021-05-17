import { observable, action } from 'mobx'
import timerProfiles from '../profiles/timerProfiles'
// import Sound from 'react-native-sound' // TODO move sound import to assets directory

class TimerStore {
  @observable title;
  @observable numRounds;
  @observable roundDuration;
  @observable restDuration;
  @observable currTimerVal;
  @observable currRound;
  @observable isRunning;
  @observable isRest;

  roundEndSound = null
  clackerSound = null

  constructor() {
    this.title = 'BOXING'
    this.numRounds = 12
    this.currRound = 1
    this.roundDuration = 18
    this.restDuration = 6
    this.currTimerVal = this.roundDuration
    this.isRunning = false
    this.isRest = false

    this.initializeSounds()
  }

  initializeSounds = () => {
    console.log('play bell') // TODO move sound import to assets directory
    // Sound.setCategory('Playback')

    // this.roundEndSound = new Sound(
    //   'round_end.mp3',
    //   Sound.MAIN_BUNDLE,
    //   (error) => {
    //     if (error) {
    //       console.log('Failed to load sound effect', error)
    //       return
    //     } else {
    //       console.log('Round End sound loaded successfully')
    //     }
    //   }
    // )

    // this.clackerSound = new Sound('clacker.mp3', Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     console.log('Failed to load sound effect', error)
    //     return
    //   } else {
    //     console.log('Clacker sound loaded successfully')
    //   }
    // })
  }

  @action loadProfile = (profile) => {
    this.title = profile.title;
    this.numRounds = profile.numRounds;
    this.roundDuration = profile.roundDuration;
    this.restDuration = profile.restDuration;
    this.currTimerVal = profile.roundDuration;
    this.currRound = 1;
    this.isRunning = false;
    this.isRest = false;
  };

  @action startTimer = () => {
    this.isRunning = true;
  };

  @action pauseTimer = () => {
    this.isRunning = false;
  };

  @action resetTimer = () => {
    this.isRunning = false;
    this.isRest = false;
  };

  @action incrementRound = () => {
    this.isRest = false;
    this.currRound++;
    this.roundDuration = this.roundDuration;
  };

  @action setRest = () => {
    this.isRest = true;
  };

  @action resetTimerStore = () => {
    this.currRound = 1;
    this.isRunning = false;
    this.isRest = false;
  }

  @action playRoundEnd = () => {
    console.log('play round end') // TODO move sound import to assets directory
    // if (!this.roundEndSound) {
    //   console.log('Sound not loaded')
    // } else {
    //   this.roundEndSound.play()
    // }
  }

  @action playClacker = () => {
    console.log('play clacker') // TODO move sound import to assets directory
    // if (!this.clackerSound) {
    //   console.log('Sound not loaded')
    // } else {
    //   this.clackerSound.play()
    // }
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

export default TimerStore;
