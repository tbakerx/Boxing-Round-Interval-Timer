import React from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

const toDoubleDigit = (val) => {
  if (val < 10) {
    newVal = '0' + val.toString()
    return newVal
  } else {
    return val
  }
}

function Slider({
  value,
  color,
  width,
  left,
  right,
}) {
  value = parseInt(value)
  return (
    <View style={{
      width: width,
      height: '150%',
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      left: left,
      right: right,
    }}>
      <Text style={{color: color, fontSize: 17, opacity: 0.1,}}>{value - 2 >= 0 ? toDoubleDigit(value - 2) : null}</Text>
      <Text style={{color: color, fontSize: 21, opacity: 0.3,}}>{value - 1 >= 0 ? toDoubleDigit(value - 1) : null}</Text>
      <View style={{
        width: width,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.13)',
        borderRadius: 7,
      }}>
        <Text style={{color: color, fontSize: 23, padding: 7,}}>{toDoubleDigit(value)}</Text>
      </View>
      <Text style={{color: color, fontSize: 21, opacity: 0.3,}}>{value + 1 < 60 ? toDoubleDigit(value + 1) : null}</Text>
      <Text style={{color: color, fontSize: 17, opacity: 0.1,}}>{value + 2 < 60 ? toDoubleDigit(value + 2) : null}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
})

export default Slider
