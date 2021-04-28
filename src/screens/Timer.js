import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useStores } from '../hooks/useStores'
import Timer from 'react-compound-timer'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'
import Switch from '../components/switch'

const toSeconds = (value) => {
  return value * 1000;
};

const TimerScreen = () => {
  const mainTimer = useRef();
  const { timerStore } = useStores();
  const [action, setAction] = useState('')

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={{position: 'absolute', top: 47, right: 66}}>
        <Switch size={33}/>
      </View>
      <TouchableOpacity
        onPress={() => {
          console.log('open menu')
        }}
        style={{position: 'absolute', top: 47, right: 17, width: 33, height: 33, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 33,}}
      >
        <Text style={{color: 'white', textAlign: 'center', marginTop: 0, fontSize: 27, fontWeight: '500'}}>i</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('cycle timer profile')
        }}>
        <Text style={styles.timerTitle}>
          {timerStore.title}
        </Text>
      </TouchableOpacity>
      {
        timerStore.currRound + 1 >= timerStore.numRounds
        ? timerStore.isRest
          ? <Text style={styles.roundText}>Up Next: Final Rd</Text>
          : <Text style={styles.roundText}>Rd {timerStore.currRound}</Text>
        : timerStore.isRest
          ? <Text style={styles.roundText}>Up Next: Rd {timerStore.currRound + 1} </Text>
          : <Text style={styles.roundText}>Rd {timerStore.currRound}</Text>
      }
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
                mainTimer.current.setTime(toSeconds(timerStore.roundDuration));
                mainTimer.current.start();
                timerStore.incrementRound();
              } else {
                if (timerStore.currRound == timerStore.numRounds) {
                  timerStore.resetTimerStore();
                  mainTimer.current.reset();
                } else {
                  mainTimer.current.setTime(toSeconds(timerStore.restDuration));
                  mainTimer.current.start();
                  timerStore.setRest();
                }
              }
            }
          }
        ]}>
        <View>
          <Text style={styles.timeText}>
            <Text>
              <View>
                <Text style={{ fontFamily: 'MiedingerLightW00-Regular', fontSize: 74, color: timerStore.isRest ? '#0066FF' : '#FF3300', }}>
                  <Timer.Minutes />
                </Text>
              </View>
              <View>
                <Text style={{ fontFamily: 'MiedingerLightW00-Regular', fontSize: 74, marginBottom: 7, color: '#A9A9A9', paddingHorizontal: 3, }}>:</Text>
              </View>
              <View>
                <Text style={{ fontFamily: 'MiedingerLightW00-Regular', fontSize: 74, color: timerStore.isRest ? '#0066FF' : '#FF3300', }}>
                  <Timer.Seconds />
                </Text>
              </View>
            </Text>
          </Text>
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
  );
};

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
    color: 'white',
  },
  roundText: {
    fontFamily: 'MiedingerLightW00-Regular',
    marginBottom: -13,
    letterSpacing: 3,
    fontSize: 23,
    color: '#DCDCDC',
  },
  timeText: {
    fontFamily: 'MiedingerLightW00-Regular',
  },
  timerControls: {
    marginTop: 47,
  },
  controlText: {
    textAlign: 'center',
    letterSpacing: 7,
    fontSize: 33,
    color: 'white',
  },
});

export default observer(TimerScreen);
