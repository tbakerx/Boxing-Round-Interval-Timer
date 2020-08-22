import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import HomeScreen from '../screens/Home'
import SettingsScreen from '../screens/Settings'
import TimerScreen from '../screens/Timer'

const Drawer = createDrawerNavigator()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Timer">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Timer" component={TimerScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
