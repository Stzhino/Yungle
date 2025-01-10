import { View, Text, Image } from 'react-native'
import React, {useState} from 'react'
import images from "../constants/images"

const MessageCards = ({profile:{name, avatar}, message, time}) => {
    const date = new Date(time);
    const formattedDate = date.toISOString().split('T')[0];
    const firstName = name.split(' ')[0];
    let fullMessage = firstName+": "+message;
    if(fullMessage.length>25){
        fullMessage = fullMessage.slice(0,25)+"...";
    }
    return (
    <View className="flex-col px-4 mb-4 ml-4 mr-4 rounded-lg p-3">
        <View className="flex-row gap-3 items-start">
            <View className="flex-row flex justify-between w-full">
                <View className="flex-row flex">
                        <View className="w-[50px] h-[50px] rounded-full justify-center items-center p-0.5">
                            <Image source={{uri:avatar}} className="w-full h-full rounded-3xl" resizeMode='cover'/>
                        </View>
                        <View>
                            <Text className="ml-3 font-psemibold text-lg">
                                {name}
                            </Text>
                            <Text className="ml-3 font-pregular text-base text-gray-500 text-ellipsis">
                                {fullMessage}
                            </Text>
                        </View>
                </View>
                <Text className="text-base font-pregular text-gray-500 mt-1">
                    {formattedDate}
                </Text>
            </View>
        </View>
    </View>
  )
}

export default MessageCards