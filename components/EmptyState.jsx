import { View, Text, Image } from 'react-native'
import React from 'react'
import images from '../constants/images'

const EmptyState = ({title}) => {
  return (
    <View className = "justify-center items-center px-4 mt-4">
        <Image source={images.noResults} className="w-[150px] h-[115px]" resizeMode='contain'/>
        <Text className="mt-7 font-psemibold text-xl">
            {title}
        </Text>
    </View>
  )
}

export default EmptyState