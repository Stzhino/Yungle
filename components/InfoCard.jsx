import { View, Text, Image } from 'react-native'
import React, {useState} from 'react'
import images from "../constants/images"
import CustomButton from "./CustomButton"

const InfoCard = ({profile:{name, career, school, company, avatar}}) => {
    let imageIcon;
    if(school=="Binghamton University, NY"){
        imageIcon=images.bing;
    }
    else if(school=="University of Pennsylvania, PA"){
        imageIcon=images.upenn;
    }
    else{
        imageIcon=images.bing;
    }
    return (
    <View className="flex-col px-4 mb-4 ml-4 mr-4 rounded-lg p-3 bg-gray-100 shadow-sm">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[50px] h-[50px] rounded-full justify-center items-center p-0.5">
                    <Image source={{uri:avatar}} className="w-full h-full rounded-3xl" resizeMode='cover'/>
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <View className = "flex flex-row items-center">
                        <Text className="text-xl text-black font-psemibold">{name}</Text>
                        <Image className="w-6 h-6 ml-2" resizeMode='contain' source={images.blueCheck}/>
                    </View>
                    <View className="flex flex-row items-center">
                        <Image className="w-5 h-5 rounded-3xl mr-2" resizeMode='contain' source = {imageIcon}
                        />
                        <Text className="text-base text-gray-500">
                            {school}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
        <View className="flex-row flex items-start items-center mt-3">
            <Image className="w-4 h-4 mr-2" resizeMode='contain' source = {images.suitcase} />
            <Text className="text-lg">{career}, {company}</Text>
        </View>
        <Text className="text-gray-500">
            10 Mutual Connections
        </Text>
    </View>
  )
}

export default InfoCard