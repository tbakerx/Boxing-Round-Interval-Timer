import 'react-native-gesture-handler'
import React from 'react'
import { StyleSheet, Text, Button } from 'react-native'
import { observer } from 'mobx-react'
import { useStores } from '../hooks/useStores'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const { settingsStore, timerStore } = useStores()

  return (
    <SafeAreaView>
      <Text>{settingsStore.testStore}</Text>
      <Text>{timerStore.testStore}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})

export default observer(Home)
