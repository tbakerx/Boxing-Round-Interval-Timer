import React from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

function PickerFacade({
  value,
  color,
  action,
}) {
  value = parseInt(value)
  return (
    <View style={styles.dialPickerFacade}>
      <Text style={{color: color, fontSize: 17, opacity: 0.3,}}>{value - 2 >= 0 ? action(value - 2) : null}</Text>
      <Text style={{color: color, fontSize: 21, opacity: 0.5,}}>{value - 1 >= 0 ? action(value - 1) : null}</Text>
      <View style={styles.pickerSelected}>
        <Text style={{color: color, fontSize: 23, padding: 7,}}>{action(value)}</Text>
      </View>
      <Text style={{color: color, fontSize: 21, opacity: 0.5,}}>{value + 1 < 60 ? action(value + 1) : null}</Text>
      <Text style={{color: color, fontSize: 17, opacity: 0.3,}}>{value + 2 < 60 ? action(value + 2) : null}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  dialPickerFacade: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pickerSelected: {
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 7,
  },
})

export default PickerFacade
