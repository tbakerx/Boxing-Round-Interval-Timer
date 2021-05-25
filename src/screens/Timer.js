import React, { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native'
import { useStores } from '../hooks/useStores'
import Timer from 'react-compound-timer'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'
import Switch from '../components/switch'
import { Picker } from '@react-native-community/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DoubleTap from '../components/double-tap'

const red = '#FF3300'
const blue = '#306EFF'
const offWhite = '#DCDCDC'
const white = '#FFFFFF'

const toSeconds = (val) => {
  return val * 1000
}

const toDoubleDigit = (val) => {
  if (val < 10) {
    newVal = '0' + val.toString()
    return newVal
  } else {
    return val
  }
}

const TimerScreen = () => {
  const saveTimer = async (rounds, Count, Rest) => {
    try {
      await AsyncStorage.setItem('@rounds', rounds.toString())
      await AsyncStorage.setItem('@Count', Count.toString())
      await AsyncStorage.setItem('@Rest', Rest.toString())
    } catch (e) {
      console.log('failed to save timer values')
    }
  }
  
  const loadTimer = async () => {
    try {
      const rounds = await AsyncStorage.getItem('@rounds')
      const Count = await AsyncStorage.getItem('@Count')
      const Rest = await AsyncStorage.getItem('@Rest')
      timerStore.setTimerStore(
        parseInt(rounds),
        parseInt(Count),
        parseInt(Rest)
      )
      restoreTimer()
      timerStore.resetTimer()
    } catch(e) {
      console.log('failed to load timer values')
    }
  }
  useEffect(() => {
    loadTimer()
  }, [])

  const mainTimer = useRef()
  const { timerStore } = useStores()
  const [finished, setFinished] = useState(false)
  const [sound, toggleSound] = useState(true)
  const [countdown, toggleCountdown] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const restoreTimer = () => {
    mainTimer.current.reset()
    mainTimer.current.pause()
    setFinished(false)
  }

  const [minutesCounted, setMinutesCounted] = useState(toDoubleDigit(Math.floor(timerStore.roundDuration / 60)))
  const [secondsCounted, setSecondsCounted] = useState(toDoubleDigit(timerStore.roundDuration % 60))
  const [rounds, setRounds] = useState(timerStore.numRounds)
  const [minutesRested, setMinutesRested] = useState(toDoubleDigit(Math.floor(timerStore.restDuration / 60)))
  const [secondsRested, setSecondsRested] = useState(toDoubleDigit(timerStore.restDuration % 60))

  let minutesCount = [], secondsCount = [], roundsCount = [], minutesRest = [], secondsRest = []
  for (mC = 0 ; mC < 60 ; mC++) { minutesCount.push(toDoubleDigit(mC)) }
  for (sC = 0 ; sC < 60 ; sC++) { secondsCount.push(toDoubleDigit(sC)) }
  for (r = 1 ; r < 100 ; r++) { roundsCount.push(r) }
  for (mR = 0 ; mR < 60 ; mR++) { minutesRest.push(toDoubleDigit(mR)) }
  for (sR = 0 ; sR < 60 ; sR++) { secondsRest.push(toDoubleDigit(sR)) }

  return (
    <View style={styles.mainView}>
      <View style={styles.mainFacade}/>

      {/* BACKGROUND VIDEO */}
      <Video
        source={require('../../assets/videos/video.mp4')}
        style={styles.backgroundVideo}
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

      {/* HELP BUTTON */}
      <View style={[styles.buttonContainer, {position: 'absolute', top: 47, left: 17, }]}>
        <TouchableOpacity
          onPress={
            () => Alert.alert(
              "CONTROLS",
              `\nTAP the timer to start and pause
              \nDOUBLE TAP the timer to restart
              \nIn the timer controls (C) menu, SCROLL the time wheels to SET the round duration [red], round quantity [white], and rest duration [blue]
              `,
              [
                { text: "OK" }
              ]
            )
          }
          style={styles.menuButton}
        >
          <Text style={styles.buttonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* SOUND TOGGLE */}
      <View style={{position: 'absolute', top: 47, right: 77, }}>
        <Switch
          onImage={`${'../../assets/images/soundOn.png'}`}
          offImage={`${'../../assets/images/soundOff.png'}`}
          value={sound}
          onPress={() => toggleSound(!sound)}
        />
      </View>

      {/* CONTROLS MENU BUTTON */}
      <View style={[styles.buttonContainer, {position: 'absolute', top: 47, right: 17, }]}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.menuButton}
        >
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
      </View>      

      {/* CONTROLS MENU */}
      {/* <View style={[styles.menuView, {zIndex: modalVisible ? 99 : -99,}]}> */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={[styles.menuFacade, {zIndex: modalVisible ? 98 : -98,}]}
          />
          <View style={styles.menuView}>
            <View style={styles.modalView}>

              {/* COUNTDOWN TOGGLE */}
              {/* <View style={{position: 'absolute', top: 17, right: 17, }}>
                <Switch
                  onImage={`${'../../assets/images/countdownOn.png'}`}
                  offImage={`${'../../assets/images/countdownOff.png'}`}
                  value={countdown}
                  onPress={() => toggleCountdown(!countdown)}
                />
              </View> */}

              {/* ROUND DURATION */}
              <View style={styles.numberDialContainer}>
              <View style={{alignItems: 'center'}}>
                <Picker
                  style={{
                    width: 55,
                    right: 21,
                    borderRadius: 7,
                    backgroundColor: 'transparent',
                  }}
                  itemStyle={[styles.numberDial, {color: red, shadowColor: red, shadowOpacity: 0.55,}]}
                  selectedValue={minutesCounted}
                  onValueChange={(itemValue, itemIndex) =>
                    setMinutesCounted(itemValue)
                  }>
                  {minutesCount.map(mC => (
                    <Picker.Item label={`${mC}`} value={mC} />
                  ))}
                </Picker>
                <View style={{position: 'absolute', top: 85,}}>
                  <Text style={{fontSize: 33, color: offWhite}}>:</Text>
                </View>
                <Picker
                  style={{
                    position: 'absolute',
                    left: 46,
                    width: 55,
                    borderRadius: 7,
                    backgroundColor: 'transparent',
                  }}
                  itemStyle={[styles.numberDial, {color: red, shadowColor: red, shadowOpacity: 0.66,}]}
                  selectedValue={secondsCounted}
                  onValueChange={(itemValue, itemIndex) => 
                    setSecondsCounted(itemValue)
                  }>
                  {secondsCount.map(sC => (
                    <Picker.Item label={`${sC}`} value={sC} />
                  ))}
                </Picker>
              </View>
              </View>

              {/* ROUNDS QUANTITY */}
              <View style={styles.numberDialContainer}>
                <View style={{alignItems: 'center'}}>
                  <Picker
                    style={{
                      position: 'absolute',
                      width: 66,
                      borderRadius: 7,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={[styles.numberDial, { color: white, shadowColor: white, shadowOpacity: 0.77,}]}
                    selectedValue={rounds}
                    onValueChange={(itemValue, itemIndex) =>
                      setRounds(itemValue)
                    }>
                    {roundsCount.map(r => (
                      <Picker.Item label={`${r}`} value={r} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* REST DURATION */}
              <View style={styles.numberDialContainer}>
              <View style={{alignItems: 'center'}}>
                <Picker
                  style={{
                    width: 55,
                    right: 21,
                    borderRadius: 7,
                    backgroundColor: 'transparent',
                  }}
                  itemStyle={[styles.numberDial, {color: blue, shadowColor: blue, shadowOpacity: 0.94, }]}
                  selectedValue={minutesRested}
                  onValueChange={(itemValue, itemIndex) =>
                    setMinutesRested(itemValue)
                  }>
                  {minutesRest.map(mR => (
                    <Picker.Item label={`${mR}`} value={mR} />
                  ))}
                </Picker>
                <View style={{position: 'absolute', top: 85,}}>
                  <Text style={{fontSize: 33, color: offWhite}}>:</Text>
                </View>
                <Picker
                  style={{
                    position: 'absolute',
                    left: 46,
                    width: 55,
                    borderRadius: 7,
                    backgroundColor: 'transparent',
                  }}
                  itemStyle={[styles.numberDial, {color: blue, shadowColor: blue, shadowOpacity: 0.94,}]}
                  selectedValue={secondsRested}
                  onValueChange={(itemValue, itemIndex) =>
                    setSecondsRested(itemValue)
                  }>
                  {secondsRest.map(sR => (
                    <Picker.Item label={`${sR}`} value={sR} />
                  ))}
                </Picker>
              </View>
              </View>

              {/* SET TIMER BUTTON */}
              <TouchableOpacity
                style={[styles.setButton, styles.buttonClose]}
                onPress={() => {
                  saveTimer(
                    parseInt(rounds),
                    (parseInt(minutesCounted) * 60 || 0) + parseInt(secondsCounted) || 0,
                    (parseInt(minutesRested) * 60 || 0) + parseInt(secondsRested) || 0
                  )
                  timerStore.setTimerStore(
                    parseInt(rounds),
                    (parseInt(minutesCounted) * 60 || 0) + parseInt(secondsCounted) || 0,
                    (parseInt(minutesRested) * 60 || 0) + parseInt(secondsRested) || 0
                  )
                  restoreTimer()
                  setModalVisible(!modalVisible)
                }}
              >
                <Text style={styles.setButtonText}>SET</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      {/* </View> */}

      {/* TIMER PROFILE */}
      {/* <TouchableOpacity
        onPress={() => {
          console.log('cycle timer profile')
        }}>
        <Text style={styles.timerTitle}>
          {timerStore.title}
        </Text>
      </TouchableOpacity> */}

      {/* TIMER VIEW */}
      <DoubleTap
        singleTap={() => {
          if (timerStore.isRunning) {
            mainTimer.current.pause()
            timerStore.pauseTimer()
          } else {
            if (finished) {
              timerStore.resetTimerStore()
              mainTimer.current.reset()
              setFinished(false)
            }
            mainTimer.current.start()
            timerStore.startTimer()
          }
        }}
        doubleTap={() => {
          restoreTimer()
          timerStore.resetTimer()
        }}
      >
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 47,
        }}>

          {/* ROUND STATUS */}
          {
            timerStore.currRound + 1 >= timerStore.numRounds
            ? timerStore.isRest
              ? <Text style={styles.roundText}>Next: Final Rd</Text>
              : <Text style={styles.roundText}>Rd {timerStore.currRound} | {timerStore.numRounds}</Text>
            : timerStore.isRest
              ? <Text style={styles.roundText}>Next: Rd {timerStore.currRound + 1}</Text>
              : <Text style={styles.roundText}>Rd {timerStore.currRound} | {timerStore.numRounds}</Text>
          }

          {/* TIMER */}
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
                    // console.log(sound)
                    timerStore.playRoundEnd()
                  }
                  if (timerStore.isRest) {
                    mainTimer.current.setTime(toSeconds(timerStore.roundDuration))
                    mainTimer.current.start()
                    timerStore.incrementRound()
                  } else {
                    if (timerStore.currRound == timerStore.numRounds) {
                      timerStore.pauseTimer()
                      mainTimer.current.pause()
                      setFinished(true)
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
                <Text>

                  {/* TIMER MINUTES */}
                  <View>
                    <Text
                      style={[styles.timerText, {
                        color: timerStore.isRest ? blue : red,
                        shadowColor: timerStore.isRest ? blue : red,
                      }]}
                    >
                      <Timer.Minutes />
                    </Text>
                  </View>

                  {/* TIMER DIVIDER */}
                  <View>
                    <Text
                      style={{
                        fontFamily: 'MiedingerLightW00-Regular',
                        fontSize: 74,
                        marginBottom: 9,
                        color: offWhite,
                        paddingHorizontal: 3,
                      }}
                    >:</Text>
                  </View>

                  {/* TIMER SECONDS */}
                  <View>
                    <Text
                      style={[styles.timerText, {
                        color: timerStore.isRest ? blue : red,
                        shadowColor: timerStore.isRest ? blue : red,
                      }]}
                    >
                      <Timer.Seconds />
                    </Text>
                  </View>
              </Text>
            </View>
          </Timer>
        </View>
      </DoubleTap>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainFacade: {
    zIndex: -99,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.77)',
  },
  // menuView: {
  //   position: 'absolute',
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  //   width: '100%',
  //   height: '47%',
  //   bottom: 0,
  // },
  menuFacade: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
    height: '100%',
    top: 0,
  },
  menuView: {
    zIndex: 99,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
    height: '47%',
    bottom: -47,
  },
  modalView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 7,
    padding: 33,
    shadowColor: white,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    width: 33,
    height: 33,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 33,
  },
  buttonText: {
    color: white,
    textAlign: 'center',
    marginTop: 0,
    fontSize: 27,
    fontWeight: '600',
  },
  timerTitle: {
    marginBottom: 47,
    letterSpacing: 3,
    fontSize: 33,
    color: offWhite,
  },
  roundText: {
    fontFamily: 'MiedingerLightW00-Regular',
    textAlign: 'center',
    marginBottom: 13,
    letterSpacing: 1,
    fontSize: 23,
    color: white,
    shadowColor: white,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.94,
    shadowRadius: 4,
    elevation: 5,
  },
  timerText: {
    fontFamily: 'MiedingerLightW00-Regular',
    fontSize: 74,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.94,
    shadowRadius: 4,
    elevation: 5,
  },
  backgroundVideo: {
    zIndex: -1,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  numberDial: {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    elevation: 5,
  },
  numberDialContainer: {
    width: '30%',
    height: '20%',
    marginTop: '7%',
  },
  setButton: {
    position: 'absolute',
    height: 47,
    width: '80%',
    bottom: '23%',
    borderRadius: 7,
    padding: 10,
    elevation: 2,
  },
  setButtonText: {
    height: 27,
    lineHeight: 27,
    color: offWhite,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
})

export default observer(TimerScreen)
