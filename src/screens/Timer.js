import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native'
import { useStores } from '../hooks/useStores'
import Timer from 'react-compound-timer'

const toSeconds = (value) => {
  return value * 1000
}

const TimerScreen = () => {
  const mainTimer = useRef()
  const { timerStore } = useStores()
  return (
    // <Image source={require('..assets/images/bg-image.jpg')}></Image>
    <ImageBackground
      source={require('../../assets/images/bg-image.jpg')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.infoDisplay}>{timerStore.title}</Text>
      <Text style={styles.timerDisplay}>RD {timerStore.currRound}</Text>
      <Timer
        ref={mainTimer}
        initialTime={toSeconds(timerStore.roundDuration)}
        direction="backward"
        startImmediately={false}
        timeToUpdate={10}
        formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
        checkpoints={[
          {
            time: toSeconds(10),
            callback: () => {
              timerStore.playClacker()
            }
          },
          {
            time: 0,
            callback: () => {
              timerStore.playRoundEnd()
              if (timerStore.isRest) {
                mainTimer.current.setTime(toSeconds(timerStore.roundDuration))
                mainTimer.current.start()
                timerStore.incrementRound()
              } else {
                if (timerStore.currRound == timerStore.numRounds) {
                  timerStore.resetTimerStore()
                  mainTimer.current.reset()
                } else {
                  mainTimer.current.setTime(toSeconds(timerStore.restDuration))
                  mainTimer.current.start()
                  timerStore.setRest()
                }
              }
            }
          }
        ]}>
        <View>
          <Text style={styles.timerDisplay}>
            <Text style={{ fontSize: 32 }}>
              <Timer.Minutes />
              <Text>:</Text>
              <Timer.Seconds />
            </Text>
          </Text>
        </View>
      </Timer>
      <Text>{'\n\n\n'}</Text>
      <TouchableOpacity onPress={() => mainTimer.current.start()}>
        <View style={styles.timerControls}>
          <Text style={styles.timerControlsText}>START</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => mainTimer.current.pause()}>
        <View style={styles.timerControls}>
          <Text style={styles.timerControlsText}>PAUSE</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          mainTimer.current.reset()
          mainTimer.current.pause()
          timerStore.currRound = 1
        }}>
        <View style={styles.timerControls}>
          <Text style={styles.timerControlsText}>RESET</Text>
        </View>
      </TouchableOpacity>
      <Image
        source={require('../../assets/images/bg-image.jpg')}
        style={styles.backgroundImage}
      />
    </ImageBackground>
  )
}

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height

const styles = StyleSheet.create({
  infoDisplay: {
    fontFamily: 'Myriad Pro'
  },
  timerDisplay: {
    color: 'white',
    fontFamily: 'MiedingerLightW00-Regular',
    textShadowColor: 'white',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10
  },
  timerControls: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 1,
    alignSelf: 'stretch',
    height: height / 10,
    width: width
  },
  timerControlsText: {
    color: 'white',
    fontFamily: 'Myriad Pro',
    textShadowColor: 'grey',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10
  },
  backgroundImage: {
    display: 'none',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  }
})

export default observer(TimerScreen)
