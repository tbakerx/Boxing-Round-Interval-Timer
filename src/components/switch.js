import React, {useState, useEffect, Component} from 'react'
import {
  View,
  Animated,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

class LinerBorderComponent extends Component {
  render() {
    const {start, end} = this.props
    return (
      <LinearGradient
        colors={['red', 'red', 'red']}
        start={{x: 0.0, y: 0.0}}
        end={{x: 1.0, y: 1.0}}
        style={styles.linearBorder}
      />
    )
  }
}

const LinerBorder = Animated.createAnimatedComponent(LinerBorderComponent)

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
  style,
  value,
  onPress,
  duration,
  gap,
  startColor,
  endColor,
  loading,
}) {
  const [animXValue] = useState(new Animated.Value(value ? 1 : 0))

  useEffect(() => {
    Animated.timing(animXValue, {
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
          value ? styles.greenStyle : styles.container,
          getContainerStyle(size),
        ]}
      >
        <Animated.View
          style={[
            getCircleStyle(size - 2 * gap),
            {
              transform: [circleTransform],
            },
          ]}
        >
          <LinerBorder start={start} end={end} />
        </Animated.View>
        {loading && <ActivityIndicator />}
      </View>
    </TouchableOpacity>
  )
}

Switch.defaultProps = {
  gap: 2,
  size: 60,
  value: false,
  duration: 200,
  startColor: ['#393b42', '#585564'],
  endColor: ['#acacac', '#BEBBCD'],
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)', // <- SWITCH INACTIVE BACKGROUND COLOR
    shadowColor: '#21202BFF',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  greenStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red', // <- SWITCH ACTIVE BACKGROUND COLOR
    shadowColor: '#21202BFF',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 3,
    shadowOpacity: 0.3,
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
