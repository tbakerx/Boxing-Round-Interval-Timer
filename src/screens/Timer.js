import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Timer from 'react-compound-timer'

const toSeconds = (value) => {
  return value * 1000
}

const TimerScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Timer
        initialTime={toSeconds(60)}
        direction="backward"
        startImmediately={false}
        timeToUpdate={10}
        checkpoints={[
          {
            time: toSeconds(10),
            callback: () => alert('Play 10 second warning')
          },
          {
            time: 0,
            callback: () => alert('countdown finished')
          }
        ]}>
        <Text style={{ fontFamily: 'Helvetica Neue' }}>
          <Text style={{ fontSize: 32 }}>
            <Timer.Minutes />
            <Text>:</Text>
            <Timer.Seconds />
          </Text>
        </Text>
      </Timer>
    </View>
  )
}

const styles = StyleSheet.create({})

export default TimerScreen
