import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import TimerScreen from '../screens/Timer'
import SettingsScreen from '../screens/Settings'

const Drawer = createDrawerNavigator()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Timer">
        <Drawer.Screen name="Timer" component={TimerScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
