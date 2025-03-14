import React from 'react';
import { View, Text, Image } from 'react-native';

export default function NotificationBox({ Notification }) {
  const { title, senderName,senderAvatar,description, time } = Notification;
  const currentDate = new Date()
    let label="seconds";
    const convertedDate=new Date(time)
    let timeDifference =(currentDate-convertedDate);
    if((timeDifference/86400000)>=1)
    {
        label="days ago"
        timeDifference=timeDifference/86400000
    }
    else if((timeDifference/3600000)>=1)
    {
        label="hours ago"
        timeDifference=timeDifference/3600000
    }
    else if(timeDifference/60000>=1)
    {
        label="minutes ago"
        timeDifference=timeDifference/60000
    }
    else
    {
        label="seconds ago"
        timeDifference=timeDifference/1000
    }
    timeDifference=Math.floor(timeDifference);
  return (
    <View className="w-full h-[80px] flex-row items-center bg-[#F0F0F0] border-2 border-[#E0E0E0] p-1 rounded-2xl">
      <View className="w-[60px] h-[60px] rounded-full ml-[10px] overflow-hidden">
        <Image source={{ uri: senderAvatar }} className="w-full h-full" />
      </View>
      <View className="ml-[5%] p-1 h-full w-[70%]">
        <Text className="font-bold text-[16px]">{title}</Text>
        <View className="mt-[2px]">
          <Text className="text-[12px]">{description}</Text>
        </View>
        <Text className="text-[10px] text-gray-500 mt-[8px]">{timeDifference} {label}</Text>
      </View>
    </View>
  );
}