import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useStores } from '../hooks/useStores'
import Timer from 'react-compound-timer'

const toSeconds = (value) => {
  return value * 1000;
};

const TimerScreen = () => {
  const mainTimer = useRef();
  const { timerStore } = useStores();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{timerStore.title}</Text>
      <Text style={{ fontFamily: 'MiedingerLightW00-Regular' }}>
        {timerStore.currRound}
      </Text>
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
          <Text style={{ fontFamily: 'MiedingerLightW00-Regular' }}>
            <Text style={{ fontSize: 32 }}>
              <Timer.Minutes />
              <Text>:</Text>
              <Timer.Seconds />
            </Text>
          </Text>
          <TouchableOpacity onPress={() => mainTimer.current.start()}>
            <View style={styles.timerButton}>
              <Text>Start Timer</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => mainTimer.current.pause()}>
            <View style={styles.timerButton}>
              <Text>Pause Timer</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              mainTimer.current.reset();
              mainTimer.current.pause();
              timerStore.currRound = 1;
            }}>
            <View style={styles.timerButton}>
              <Text>Restart Timer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Timer>
    </View>
  );
};

const styles = StyleSheet.create({
  timerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'blue',
    borderWidth: 1,
    fontFamily: 'MiedingerLightW00-Regular'
  },
});

export default observer(TimerScreen);
