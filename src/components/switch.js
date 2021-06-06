import React, { useState, useEffect, Component } from 'react'
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

class LinearBorderComponent extends Component {
  render() {
    const {start, end} = this.props
    return (
      <LinearGradient
        colors={['white', 'white', 'white']}
        start={{x: 0.0, y: 0.0}}
        end={{x: 1.0, y: 1.0}}
        style={styles.linearBorder}
      />
    )
  }
}

const LinearBorder = Animated.createAnimatedComponent(LinearBorderComponent)

function getContainerStyle(size) {
  return {width: size * 2, height: size, borderRadius: size / 2}
}

function getCircleStyle(size) {
  return {
    width: size - 4,
    height: size - 4,
    borderRadius: size / 2 - 2,
    overflow: 'hidden',
    marginLeft: 2,
  }
}

function Switch({
  size,
  containerStyle,
  value,
  onPress,
  duration,
  gap,
  startColor,
  endColor,
  loading,
  images,
}) {
  let onImage
  let offImage
  if (images === 'sound') {
    onImage = require('../../assets/images/soundOn.png')
    offImage = require('../../assets/images/soundOff.png')
  }
  if (images === 'eye') {
    onImage = require('../../assets/images/eyeOn.png')
    offImage = require('../../assets/images/eyeOff.png')
  }
  if (images === 'count') {
    onImage = require('../../assets/images/countOn.png')
    offImage = require('../../assets/images/countOff.png')
  }

  const [animXValue] = useState(new Animated.Value(value ? 1 : 0))

  useEffect(() => {
    Animated.timing(animXValue, {
      useNativeDriver: false,
      fromValue: value ? 0 : 1,
      toValue: value ? 1 : 0,
      duration,
    }).start()
  }, [value, duration, animXValue])

  const start = animXValue.interpolate({
    inputRange: [0, 1],
    outputRange: startColor,
  })

  const end = animXValue.interpolate({
    inputRange: [0, 1],
    outputRange: endColor,
  })

  const circleTransform = {
    translateX: animXValue.interpolate({
      inputRange: [0, 1],
      outputRange: [gap, size + gap],
    }),
  }

  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      activeOpacity={0.8}
      style={containerStyle}
    >
      <View
        style={[
          value ? styles.active : styles.inactive,
          getContainerStyle(size),
        ]}
      >
        <View style={{
          position: 'absolute',
          width: '50%',
          alignItems: 'center',
          left: value ? '50%' : '0%',
        }}>
          <Image
            source={value ? onImage : offImage}
            style={{
              borderRadius: 33,
              zIndex: 99,
              height: 15,
              width: 15,
            }}
            height={15}
            width={15}
          />
        </View>
        <Animated.View
          style={[
            getCircleStyle(size - 2 * gap),
            {
              transform: [circleTransform],
              zIndex: -99,
            },
          ]}
        >
          <LinearBorder start={start} end={end} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

Switch.defaultProps = {
  gap: 2,
  size: 33,
  value: false,
  duration: 100,
  startColor: ['#393b42', '#585564'],
  endColor: ['#acacac', '#BEBBCD'],
}

const styles = StyleSheet.create({
  inactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  active: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  linearBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default Switch
