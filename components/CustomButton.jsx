import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={.7}
    className={`rounded-xl justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50': ''}`}
    disabled={isLoading}
    >
        <Text className={`font-psemibold text-lg ${textStyles}`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton