import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useStores } from '../hooks/useStores'
import Timer from 'react-compound-timer'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'
import Switch from '../components/switch'
import Modal from '../components/modal'

const toSeconds = (value) => {
  return value * 1000
}

const TimerScreen = () => {
  const mainTimer = useRef()
  const { timerStore } = useStores()
  const [sound, toggleSound] = useState(true)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      {/* BACKGROUND VIDEO */}
      <Video
        source={require('../../assets/video/video.mp4')}
        style={{height: '100%', width: '100%', zIndex: -1, position: 'absolute',}}
        muted={true}
        repeat={true}
        resizeMode={'cover'}
        rate={1.0}
        ignoreSilentSwitch={'obey'}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.47)', 'rgba(0, 0, 0, 0.74)', 'rgba(0, 0, 0, 0.47)']}
        end={{x: 1, y: 1}}
        start={{x: 1, y: 0}}
        style={{
          ...StyleSheet.absoluteFillObject,
          position: 'absolute',
          zIndex: 0,
        }}
      />

      {/* SOUND TOGGLE */}
      <View style={{position: 'absolute', top: 47, right: 66}}>
        <Switch
          value={sound}
          onPress={() => toggleSound(!sound)}
        />
      </View>

      {/* MODAL */}
      <View style={{position: 'absolute', top: 47, right: 17}}>
        <Modal/>
      </View>

      {/* TIMER PROFILE */}
      <TouchableOpacity
        onPress={() => {
          console.log('cycle timer profile')
        }}>
        <Text style={styles.timerTitle}>
          {timerStore.title}
        </Text>
      </TouchableOpacity>

      {/* ROUND STATUS */}
      {
        timerStore.currRound + 1 >= timerStore.numRounds
        ? timerStore.isRest
          ? <Text style={styles.roundText}>Up Next: Final Rd</Text>
          : <Text style={styles.roundText}>Rd {timerStore.currRound}</Text>
        : timerStore.isRest
          ? <Text style={styles.roundText}>Up Next: Rd {timerStore.currRound + 1} </Text>
          : <Text style={styles.roundText}>Rd {timerStore.currRound}</Text>
      }

      {/* TIMER DISPLAY */}
      <Timer
        ref={mainTimer}
        initialTime={toSeconds(timerStore.roundDuration)}
        direction="backward"
        startImmediately={false}
        timeToUpdate={10}
        onReset={() => mainTimer.current.setTime(toSeconds(timerStore.roundDuration))}
        formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
        checkpoints={[
          {
            time: toSeconds(10),
            callback: () => {
              if (sound) {
                console.log(sound)
                timerStore.playClacker()
              }
            }
          },
          {
            time: 0,
            callback: () => {
              if (sound) {
                console.log(sound)
                timerStore.playRoundEnd()
              }
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
          <Text style={{
            fontFamily: 'MiedingerLightW00-Regular',
            shadowColor: timerStore.isRest ? '#306EFF' : '#FF3300',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.94,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <Text>
              <View>
                <Text
                  style={{
                    fontFamily: 'MiedingerLightW00-Regular',
                    fontSize: 74,
                    color: timerStore.isRest ? '#306EFF' : '#FF3300',
                  }}
                >
                  <Timer.Minutes />
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: 'MiedingerLightW00-Regular',
                    fontSize: 74,
                    marginBottom: 7,
                    color: '#A9A9A9',
                    paddingHorizontal: 3,
                  }}
                >:</Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: 'MiedingerLightW00-Regular',
                    fontSize: 74,
                    color: timerStore.isRest ? '#306EFF' : '#FF3300',
                  }}
                >
                  <Timer.Seconds />
                </Text>
              </View>
            </Text>
          </Text>

        {/* TIMER CONTROLS */}
        <View>
          {timerStore.isRunning ?
            <TouchableOpacity
              style={styles.timerControls}
              onPress={() => {
                mainTimer.current.pause()
                timerStore.pauseTimer()
              }}
            >
              <Text style={styles.controlText}>PAUSE</Text>
            </TouchableOpacity>:
            <TouchableOpacity
              style={styles.timerControls}
              onPress={() => {
                mainTimer.current.start()
                timerStore.startTimer()
              }}
            >
              <Text style={styles.controlText}>START</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={styles.timerControls}
            onPress={() => {
              mainTimer.current.reset()
              mainTimer.current.pause()
              timerStore.currRound = 1
              timerStore.resetTimer()
            }}
          >
            <Text style={styles.controlText}>RESET</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Timer>
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  timerTitle: {
    marginBottom: 47,
    letterSpacing: 3,
    fontSize: 33,
    color: '#DCDCDC',
  },
  roundText: {
    fontFamily: 'MiedingerLightW00-Regular',
    textAlign: 'center',
    marginBottom: -13,
    letterSpacing: 3,
    fontSize: 23,
    color: '#DCDCDC',
  },
  timerControls: {
    marginTop: 47,
  },
  controlText: {
    textAlign: 'center',
    letterSpacing: 7,
    fontSize: 33,
    color: '#DCDCDC',
  },
})

export default observer(TimerScreen)
