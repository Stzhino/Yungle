import { View, Text, Image } from 'react-native'
import React, {useState} from 'react'
import images from "../constants/images"

const FriendCards = ({profile:{accountId, $id, name, career, school, company, avatar, premium}}) => {
    // console.log("Account ID:" + accountId)
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
    <View className="flex-col p-3 px-4 bg-gray-100 mb-4 ml-4 mr-4 rounded-lg shadow-sm">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[50px] h-[50px] rounded-full justify-center items-center p-0.5">
                    <Image source={{uri:avatar}} className="w-full h-full rounded-3xl" resizeMode='cover'/>
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <View className = "flex justify-between flex-row">
                        <View className = "flex flex-row items-center">
                            <Text className="text-xl text-black font-psemibold">{name}</Text>
                            <Image className="w-6 h-6 ml-2" resizeMode='contain' source={images.blueCheck}/>
                        </View>
                        <View className = "flex flex-row items-center bg-yellow-100 rounded-lg">
                            {premium?(<Image className="w-6 h-6  ml-1" resizeMode='contain' source={images.premium}/>):(<></>)}
                            {premium?(<Text className="font-psemibold text-orange-400 px-2">Premium</Text>):(<></>)}
                        </View>
                    </View>
                    <View className="flex flex-row items-center">
                        <Image className="w-5 h-5 rounded-3xl mr-2" resizeMode='contain' source = {imageIcon}
                        />
                        <Text className="text-base text-gray-500">
                            {school || "Binghamton University"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
        <View className="flex-row flex items-start items-center mt-3">
            <Image className="w-4 h-4 mr-2" resizeMode='contain' source = {images.suitcase} />
            <Text className="text-lg">{career}, {company}</Text>
        </View>
    </View>
  )
}

export default FriendCards