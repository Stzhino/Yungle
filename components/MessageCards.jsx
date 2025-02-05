import { View, Text, Image } from 'react-native'
import React, {useState} from 'react'
import images from "../constants/images"

const MessageCards = ({profile:{name, avatar}, message, time}) => {
    const date = new Date(time);
    const formattedDate = date.toISOString().split('T')[0];
    const firstName = name.split(' ')[0];
    let fullMessage = firstName + ": " + message;
    
    if (fullMessage.length > 25) {
        fullMessage = fullMessage.slice(0, 25) + "...";
    }
    
    return (
        <View className="flex-col px-4 mb-4 ml-4 mr-4 rounded-lg p-3">
            <View className="flex-row gap-3 items-start">
                <View>
                    <Text className="ml-3 font-psemibold text-lg">
                        {name}
                    </Text>
                    <Text className="ml-3 font-pregular text-base text-gray-500 text-ellipsis">
                        {fullMessage}
                    </Text>
                </View>
                <Text className="ml-3 font-pregular text-base text-gray-500 mt-1">
                    {formattedDate}
                </Text>
            </View>
        </View>
  )
}

export default MessageCards