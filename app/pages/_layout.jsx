import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { FlatList } from 'react-native'

const PageLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name = "Room"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}

export default PageLayout