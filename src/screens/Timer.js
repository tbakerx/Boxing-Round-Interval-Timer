import React, { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Image, StatusBar, Dimensions, Platform, } from 'react-native'
import { useStores } from '../hooks/useStores'
import Timer from 'react-compound-timer'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'
import Switch from '../components/switch'
import Slider from '../components/slider'
import { Picker } from '@react-native-community/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DoubleTap from '../components/double-tap'
// import { BlurView } from '@react-native-community/blur'
import videoSource from '../../assets/videos/video.mp4'

const CountDown = Timer

StatusBar.setBarStyle('light-content', true)

const windowWidth = Dimensions.get('window').width
// const windowHeight = Dimensions.get('window').height

const red = '#FF3300'
const blue = '#306EFF'
// const yellow = '#F7FF00'
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
  const { timerStore } = useStores()

  const saveTimer = async (rounds, count, rest) => {
    try {
      await AsyncStorage.setItem('@Rounds', rounds.toString())
      await AsyncStorage.setItem('@Count', count.toString())
      await AsyncStorage.setItem('@Rest', rest.toString())
    } catch (e) {
      console.log(e, 'failed to save timer values')
    }
  }
  const loadTimer = async () => {
    try {
      const rounds = parseInt(await AsyncStorage.getItem('@Rounds'))
      const count = parseInt(await AsyncStorage.getItem('@Count'))
      const rest = parseInt(await AsyncStorage.getItem('@Rest'))
      timerStore.setTimer(
        rounds ? rounds : timerStore.numRounds,
        count ? count : timerStore.roundDuration,
        rest ? rest : timerStore.restDuration
      )
      restoreTimer()
      timerStore.resetTimer()
    } catch (e) {
      console.log(e, 'failed to load timer values')
      timerStore.setTimer(
        timerStore.numRounds,
        timerStore.roundDuration,
        timerStore.restDuration
      )
      restoreTimer()
      timerStore.resetTimer()
    }
  }
  const saveSoundToggle = async val => {
    try {
      await AsyncStorage.setItem('@SoundToggle', val ? '1' : '0')
    } catch (e) {
      console.log(e, 'failed to save sound toggle')
    }
  }
  const loadSoundToggle = async () => {
    try {
      const sound = parseInt(await AsyncStorage.getItem('@SoundToggle'))
      timerStore.setSound(sound ? true : false)
    } catch (e) {
      console.log(e, 'failed to load sound toggle')
      timerStore.setSound(true)
    }
  }
  const saveVideoToggle = async val => {
    try {
      await AsyncStorage.setItem('@VideoToggle', val ? '1' : '0')
    } catch (e) {
      console.log(e, 'failed to save video toggle')
    }
  }
  const loadVideoToggle = async () => {
    try {
      const video = parseInt(await AsyncStorage.getItem('@VideoToggle'))
      timerStore.setVideo(video ? true : false)
    } catch (e) {
      console.log(e, 'failed to load video toggle')
      timerStore.setVideo(true)
    }
  }
  const saveToggleCountDown = async val => {
    try {
      await AsyncStorage.setItem('@CountDownToggle', val ? '1' : '0')
    } catch (e) {
      console.log(e, 'failed to save countdown toggle')
    }
  }
  const loadCountDownToggle = async () => {
    try {
      const countDown = parseInt(await AsyncStorage.getItem('@CountDownToggle'))
      timerStore.setCountDown(countDown ? true : false)
    } catch (e) {
      console.log(e, 'failed to load countdown toggle')
      timerStore.setCountDown(false)
    }
  }

  const mainTimer = useRef()
  const countDownTimer = useRef()
  const [finished, setFinished] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const restoreTimer = () => {
    mainTimer.current.pause()
    mainTimer.current.reset()
    setFinished(false)
  }

  const [minutesCounted, setMinutesCounted] = useState(toDoubleDigit(0))
  const [secondsCounted, setSecondsCounted] = useState(toDoubleDigit(0))
  const [rounds, setRounds] = useState(1)
  const [minutesRested, setMinutesRested] = useState(toDoubleDigit(0))
  const [secondsRested, setSecondsRested] = useState(toDoubleDigit(0))

  let minutesCount = [], secondsCount = [], roundsCount = [], minutesRest = [], secondsRest = []
  for (mC = 0 ; mC < 60 ; mC++) { minutesCount.push(toDoubleDigit(mC)) }
  for (sC = 0 ; sC < 60 ; sC++) { secondsCount.push(toDoubleDigit(sC)) }
  for (r = 1 ; r < 100 ; r++) { roundsCount.push(r) }
  for (mR = 0 ; mR < 60 ; mR++) { minutesRest.push(toDoubleDigit(mR)) }
  for (sR = 0 ; sR < 60 ; sR++) { secondsRest.push(toDoubleDigit(sR)) }

  useEffect(() => {
    loadTimer()
    loadSoundToggle()
    loadVideoToggle()
    loadCountDownToggle()
    const loadSetTimers = async () => {
      const rounds = parseInt(await AsyncStorage.getItem('@Rounds'))
      const count = parseInt(await AsyncStorage.getItem('@Count'))
      const rest = parseInt(await AsyncStorage.getItem('@Rest'))
      setMinutesCounted(toDoubleDigit(Math.floor(count / 60)))
      setSecondsCounted(toDoubleDigit(count % 60))
      setRounds(rounds)
      setMinutesRested(toDoubleDigit(Math.floor(rest / 60)))
      setSecondsRested(toDoubleDigit(rest % 60))
    }
    loadSetTimers()
  }, [])

  return (
    <View style={[styles.mainView,
      {backgroundColor: timerStore.isRunning
        ? timerStore.isRest
          ? blue
          : red
        : offWhite
      }]
    }>

      <StatusBar hidden />

      {/* BACKGROUND FACADE*/}
      <View style={styles.mainFacade}/>

      {/* BACKGROUND VIDEO */}
      {timerStore.video && <Video
        source={videoSource}
        style={styles.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode={'cover'}
        rate={1.0}
        ignoreSilentSwitch={'obey'}
      />}
      <LinearGradient
        colors={
          modalVisible
            ? ['rgba(0, 0, 0, 0.47)', 'rgba(0, 0, 0, 0.94)', 'rgba(0, 0, 0, 1)']
            : ['rgba(0, 0, 0, 0.47)', 'rgba(0, 0, 0, 0.74)', 'rgba(0, 0, 0, 0.47)']
        }
        end={{x: 1, y: 1}}
        start={{x: 1, y: 0}}
        style={{
          ...StyleSheet.absoluteFillObject,
          position: 'absolute',
          zIndex: 0,
        }}
      />

      {/* CONTROLS MENU VIEW */}
      <TouchableOpacity
        style={[styles.buttonContainer, {position: 'absolute', top: 47, right: 17,}]}
        onPress={() => setModalVisible(true)}
      >
        <View style={{
          top: 5,
          flex: 1,
          alignItems: 'center'
        }}>
          <Image
            source={require('../../assets/images/settings.png')}
            style={{
              top: 1,
              height: 20,
              width: 20,
            }}
            height={20}
            width={20}
          />
        </View>
      </TouchableOpacity>

      {/* CONTROLS MENU */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        {/* HELP BUTTON */}
        <TouchableOpacity
          style={[styles.buttonContainer, {position: 'absolute', top: 94, right: 17,}]}
          onPress={
            () => Alert.alert(
              "CONTROLS",
              `\nTAP the timer to start and pause
              \nDOUBLE TAP the timer to restart
              \nTOGGLE timer countdown, sound, and background video
              \nSCROLL the time wheels to SET the round duration [red], round quantity [white], and rest duration [blue]
              `,
              [
                { text: "OK" }
              ]
            )
          }
        >
          <View style={{
            top: 5,
            flex: 1,
            alignItems: 'center'
          }}>
            <Image
              source={require('../../assets/images/question.png')}
              style={{
                top: 1,
                height: 20,
                width: 20,
              }}
              height={20}
              width={20}
            />
          </View>
        </TouchableOpacity>

        {/* COUNTDOWN TOGGLE */}
        <View style={{zIndex: 999, position: 'absolute', top: 141, right: 17,}}>
          <Switch
            images={`count`}
            value={timerStore.countDown}
            onPress={() => {
              timerStore.toggleCountDown()
              saveToggleCountDown(timerStore.countDown)
            }}
          />
        </View>

        {/* SOUND TOGGLE */}
        <View style={{zIndex: 999, position: 'absolute', top: 188, right: 17,}}>
          <Switch
            images={`sound`}
            value={timerStore.sound}
            onPress={() => {
                timerStore.toggleSound()
                saveSoundToggle(timerStore.sound)
            }}
          />
        </View>

        {/* VIDEO TOGGLE */}
        <View style={{zIndex: 999, position: 'absolute', top: 235, right: 17,}}>
          <Switch
            images={`eye`}
            value={timerStore.video}
            onPress={() => {
              timerStore.toggleVideo()
              saveVideoToggle(timerStore.video)
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={[styles.menuFacade, {zIndex: modalVisible ? 98 : -98,}]}
        >
          {/* <BlurView
            style={{width: '100%', height: '110%'}}
            blurType='dark'
            blurAmount={1}
            reducedTransparencyFallbackColor={'transparent'}
          /> */}
        </TouchableOpacity>

        <View style={styles.menuView}>
          <View style={styles.modalView}>

            {Platform.OS == 'android' &&
              <View style={styles.dialsContainer}>

                {/* ROUND DURATION */}
                {/* <View style={styles.numberDialContainer}>
                  <View style={{alignItems: 'center'}}>
                    <Slider value={minutesCounted} color={red} width={44} right={44} />
                    <Picker
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        width: 44,
                        height: 147,
                        right: 60,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}
                      itemStyle={[styles.numberDial, {color: red, shadowColor: red, shadowOpacity: 0.55,}]}
                      selectedValue={minutesCounted}
                      onValueChange={(itemValue) =>
                        setMinutesCounted(itemValue)
                      }>
                      {minutesCount.map(mC => (
                        <Picker.Item label={`${mC}`} value={mC} />
                      ))}
                    </Picker>
                    <View style={{position: 'absolute', top: 47, right: 53,}}>
                      <Text style={{fontSize: 33, color: offWhite}}>:</Text>
                    </View>
                    <View style={{position: 'absolute'}}>
                      <Slider value={secondsCounted} color={red} width={44} left={8} />
                    </View>
                    <Picker
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        width: 44,
                        height: 147,
                        left: 25,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}
                      itemStyle={[styles.numberDial, {color: red, shadowColor: red, shadowOpacity: 0.66,}]}
                      selectedValue={secondsCounted}
                      onValueChange={(itemValue) => 
                        setSecondsCounted(itemValue)
                      }>
                      {secondsCount.map(sC => (
                        <Picker.Item label={`${sC}`} value={sC} />
                      ))}
                    </Picker>
                  </View>
                </View> */}

                {/* ROUNDS QUANTITY */}
                {/* <View style={styles.numberDialContainer}>
                  <View style={{alignItems: 'center'}}>
                    <Slider value={rounds} color={white} width={55} />
                    <Picker
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        width: 55,
                        height: 147,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}
                      itemStyle={[styles.numberDial, { color: white, shadowColor: white, shadowOpacity: 0.77,}]}
                      selectedValue={rounds}
                      onValueChange={(itemValue) =>
                        setRounds(itemValue)
                      }>
                      {roundsCount.map(r => (
                        <Picker.Item label={`${r}`} value={r} />
                      ))}
                    </Picker>
                  </View>
                </View> */}


                {/* REST DURATION */}
                {/* <View style={styles.numberDialContainer}>
                  <View style={{alignItems: 'center'}}>
                    <Slider value={minutesRested} color={blue} width={44} right={8} />
                    <Picker
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        width: 44,
                        height: 147,
                        right: 25,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}
                      itemStyle={[styles.numberDial, {color: blue, shadowColor: blue, shadowOpacity: 0.94,}]}
                      selectedValue={minutesRested}
                      onValueChange={(itemValue) =>
                        setMinutesRested(itemValue)
                      }>
                      {minutesRest.map(mR => (
                        <Picker.Item label={`${mR}`} value={mR} />
                      ))}
                    </Picker>
                    <View style={{position: 'absolute', top: 47, left: 53,}}>
                      <Text style={{fontSize: 33, color: offWhite}}>:</Text>
                    </View>
                    <View style={{position: 'absolute'}}>
                      <Slider value={secondsRested} color={blue} width={44} left={44} />
                    </View>
                    <Picker
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        width: 44,
                        height: 147,
                        left: 60,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}
                      itemStyle={[styles.numberDial, {color: blue, shadowColor: blue, shadowOpacity: 0.94,}]}
                      selectedValue={secondsRested}
                      onValueChange={(itemValue) =>
                        setSecondsRested(itemValue)
                      }>
                      {secondsRest.map(sR => (
                        <Picker.Item label={`${sR}`} value={sR} />
                      ))}
                    </Picker>
                  </View>
                </View> */}

              </View>
            }

            {Platform.OS == 'ios' &&
              <View style={styles.dialsContainer}>
                {/* ROUND DURATION */}
                <View style={styles.dialSlider}>
                  <Picker
                    style={{
                      width: '100%',
                      borderRadius: 7,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={[styles.numberDial, {color: red, shadowColor: red, shadowOpacity: 0.47,}]}
                    selectedValue={minutesCounted}
                    onValueChange={(itemValue) =>
                      setMinutesCounted(itemValue)
                    }>
                    {minutesCount.map(mC => (
                      <Picker.Item label={`${mC}`} value={mC} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.dialDivider}>
                  <Text style={{fontSize: 33, color: offWhite, bottom: 2,}}>:</Text>
                </View>
                <View style={styles.dialSlider}>
                  <Picker
                    style={{
                      width: '100%',
                      borderRadius: 7,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={[styles.numberDial, {color: red, shadowColor: red, shadowOpacity: 0.47,}]}
                    selectedValue={secondsCounted}
                    onValueChange={(itemValue) => 
                      setSecondsCounted(itemValue)
                    }>
                    {secondsCount.map(sC => (
                      <Picker.Item label={`${sC}`} value={sC} />
                    ))}
                  </Picker>
                </View>

                {/* ROUNDS QUANTITY */}
                <View style={[styles.dialSlider, {marginHorizontal: '3%'}]}>
                  <Picker
                    style={{
                      width: '100%',
                      borderRadius: 7,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={[styles.numberDial, { color: white, shadowColor: white, shadowOpacity: 0.47,}]}
                    selectedValue={rounds}
                    onValueChange={(itemValue) =>
                      setRounds(itemValue)
                    }>
                    {roundsCount.map(r => (
                      <Picker.Item label={`${r}`} value={r} />
                    ))}
                  </Picker>
                </View>

                {/* REST DURATION */}
                <View style={styles.dialSlider}>
                  <Picker
                    style={{
                      width: '100%',
                      borderRadius: 7,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={[styles.numberDial, {color: blue, shadowColor: blue, shadowOpacity: 0.47,}]}
                    selectedValue={minutesRested}
                    onValueChange={(itemValue) =>
                      setMinutesRested(itemValue)
                    }>
                    {minutesRest.map(mR => (
                      <Picker.Item label={`${mR}`} value={mR} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.dialDivider}>
                  <Text style={{fontSize: 33, color: offWhite, bottom: 2,}}>:</Text>
                </View>
                <View style={styles.dialSlider}>
                  <Picker
                    style={{
                      width: '100%',
                      borderRadius: 7,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={[styles.numberDial, {color: blue, shadowColor: blue, shadowOpacity: 0.47,}]}
                    selectedValue={secondsRested}
                    onValueChange={(itemValue) =>
                      setSecondsRested(itemValue)
                    }>
                    {secondsRest.map(sR => (
                      <Picker.Item label={`${sR}`} value={sR} />
                    ))}
                  </Picker>
                </View>

              </View>
            }

            {/* SET TIMER BUTTON */}
            <TouchableOpacity
              style={styles.setButton}
              onPress={() => {
                saveTimer(
                  parseInt(rounds),
                  (parseInt(minutesCounted) * 60 || 0) + parseInt(secondsCounted) || 0,
                  (parseInt(minutesRested) * 60 || 0) + parseInt(secondsRested) || 0
                )
                timerStore.setTimer(
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

      {/* TIMER VIEW */}
      <DoubleTap
        singleTap={() => {
          if (timerStore.countDown && timerStore.isInit) {
            timerStore.setDisplayCountDown(true)
            countDownTimer.current.start()
          } else {
            if (timerStore.isRunning) {
              mainTimer.current.pause()
              timerStore.pauseTimer()
            } else {
              if (finished) {
                mainTimer.current.reset()
                timerStore.resetTimer()
                setFinished(false)
              }
              mainTimer.current.start()
              timerStore.startTimer()
            }
          }
        }}
        doubleTap={() => {
          timerStore.setDisplayCountDown(false)
          countDownTimer.current.pause()
          countDownTimer.current.reset()
          restoreTimer()
          timerStore.resetTimer()
        }}
      >
        <View style={{
          zIndex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 47,
          height: '100%',
          width: '100%',
        }}>

          {/* ROUND STATUS */}
          {
            finished
              ? <Text style={styles.roundText}>End</Text>
              : timerStore.currRound + 1 >= timerStore.numRounds
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

            <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap',}}>

              {/* TIMER MINUTES */}
              <View style={{width: windowWidth,}}>
                <Text
                  style={[styles.timerText, {
                    color: timerStore.isRest ? blue : red,
                    shadowColor: timerStore.isRest ? blue : red,
                    textAlign: 'right'
                  }]}
                >
                  <Timer.Minutes />
                </Text>
              </View>

              {/* TIMER DIVIDER */}
              <View style={{width: windowWidth / 13, alignItems: 'center',}}>
                <Text
                  style={{
                    fontFamily: 'MiedingerLightW00-Regular',
                    fontSize: 77,
                    color: offWhite,
                    bottom: 9,
                  }}
                  >:</Text>
              </View>

              {/* TIMER SECONDS */}
              <View style={{width: windowWidth,}}>
                <Text
                  style={[styles.timerText, {
                    color: timerStore.isRest ? blue : red,
                    shadowColor: timerStore.isRest ? blue : red,
                  }]}
                >
                  <Timer.Seconds />
                </Text>
              </View>
            </View>
          </Timer>
          {/* COUNTDOWN */}
          <CountDown
            ref={countDownTimer}
            initialTime={toSeconds(10)}
            direction="backward"
            startImmediately={false}
            timeToUpdate={10}
            onReset={() => countDownTimer.current.setTime(toSeconds(10))}
            formatValue={(value) => `${value + 1 > 10 ? '' : value + 1}`}
            checkpoints={[
              {
                time: toSeconds(0),
                callback: () => {
                  countDownTimer.current.pause()
                  countDownTimer.current.reset()
                  mainTimer.current.start()
                  timerStore.setDisplayCountDown(false)
                  timerStore.startTimer()
                }
              },
            ]}
          >
            <View style={{
              width: 100,
              height: 100,
              position: 'absolute',
              alignItems: 'center',
              alignContent: 'center',
              top: 120,
            }}>
              <Text
                style={[styles.timerText, {
                  fontSize: 47,
                  color: white,
                  shadowColor: white,
                  display: timerStore.displayCountDown ? 'flex' : 'none',
                }]}
              >
                <CountDown.Seconds/>
              </Text>
            </View>
          </CountDown>
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
  menuView: {
    zIndex: 99,
    position: 'absolute',
    width: '100%',
    height: '47%',
    bottom: 0,
  },
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
  modalView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 17,
  },
  dialsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
    // alignContent: 'flex-start',
    // height: '70%',
    width: '100%',
  },
  dialSlider: {
    width: '15%',
    height: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  dialDivider: {
    width: '2%',
    height: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  numberDial: {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    // elevation: 5,
  },
  // numberDialContainer: {
  //   width: '30%',
  //   height: '20%',
  //   marginTop: '7%',
  //   backgroundColor: 'red',
  // },
  buttonContainer: {
    zIndex: 999,
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
    // elevation: 5,
  },
  timerText: {
    // display: 'flex', flexDirection: 'row', flexWrap: 'nowrap',
    fontFamily: 'MiedingerLightW00-Regular',
    fontSize: 74,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.94,
    shadowRadius: 4,
    // elevation: 5,
  },
  setButton: {
    // position: 'absolute',
    alignContent: 'flex-end',
    height: 47,
    width: '80%',
    bottom: 13,
    borderRadius: 7,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.13)',
    // elevation: 2,
  },
  setButtonText: {
    height: 27,
    lineHeight: 27,
    color: offWhite,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backgroundVideo: {
    zIndex: -1,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
})

export default observer(TimerScreen)
