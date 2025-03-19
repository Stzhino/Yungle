import { View, Text, Image, TouchableOpacity } from 'react-native';
import icons from '../constants/icons';
import React, {useState, useEffect} from 'react';
import { updateConnection, updateNotif } from '../lib/appwrite';
import { calculateTimeDifference } from '../lib/calculation';
export default function NotificationBox({ Notification }) {
  const { title, sender,description, time } = Notification;
  const timeDifference = calculateTimeDifference(time);
  const [Loading, setLoading] = useState(true)
  const requestUpdate = async(sender, wasAccepted) => {
    try{
      if(Loading){
        await updateConnection(sender, wasAccepted)
        console.log("connection updated")
      }
      setLoading(false)
      await updateNotif(sender, wasAccepted)
      console.log("notif updated")
      setLoading(true)
    }
    catch(error){
      Alert.alert('Error', error.message);
    }
  }
  return (
    <View>
      {title=="Friend Request"?<View className="w-full h-[100px] flex-row items-center bg-[#F0F0F0] border-2 border-[#E0E0E0] p-1 rounded-2xl">
        <View className="w-[60px] h-[60px] rounded-full ml-[10px] overflow-hidden">
          <Image source={{ uri: sender.avatar }} className="w-full h-full" />
        </View>
        <View className="ml-[5%] p-1 h-full w-[45%]">
          <Text className="font-psemibold text-[16px]">{title}</Text>
          <View className="mt-[2px]">
            <Text className="text-[12px] font-pregular">{description}</Text>
          </View>
          <Text className="text-[10px] font-pregular text-gray-500 mt-[8px]">{timeDifference} {label}</Text>
        </View>
        <View className="flex-row mr-2 w-[30%]">
          <TouchableOpacity onPress={()=>requestUpdate(sender.username,true)}>
            <Image source={icons.check} className="w-14 h-14 mb-2 bg-primary p-2 mr-2 rounded-full" resizeMode='contain'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>requestUpdate(sender.username,false)}>
            <Image source={icons.close} className="w-14 h-14 mb-2 bg-gray-200 p-3 rounded-full" resizeMode='contain'/>
          </TouchableOpacity>
        </View>
      </View>:
      <View className="w-full h-[90px] flex-row items-center bg-[#F0F0F0] border-2 border-[#E0E0E0] p-1 rounded-2xl">
        <View className="w-[60px] h-[60px] rounded-full ml-[10px] overflow-hidden">
          <Image source={{ uri: sender.avatar }} className="w-full h-full" />
        </View>
        <View className="ml-[5%] p-1 h-full w-[75%]">
          <Text className="font-psemibold text-[16px]">{title}</Text>
          <View className="mt-[2px]">
            <Text className="text-[12px] font-pregular">{description}</Text>
          </View>
          <Text className="text-[10px] font-pregular text-gray-500 mt-[8px]">{timeDifference}</Text>
        </View>
      </View>
    }
    </View>
  );
}