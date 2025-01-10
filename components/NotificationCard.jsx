import { View, Text, Image } from 'react-native'
import React from 'react'
import icons from '../constants/icons'

// add profile name and avatar later with backend implementation
const NotificationCard = ({name, typeNotif, time, comment}) => {
    let notif;
    let desc;
    if(typeNotif=="statusupdate"){
        notif="Status Update";
        desc="Your friend " + name + " has updated their status";
    }
    else if(typeNotif=="like"){
        notif="New Like";
        desc= name + " just liked your post!";
    }
    else if(typeNotif=="comment"){
        notif="New Comment";
        desc= name + " commented: " + comment;
    }
    else if(typeNotif=="follower"){
        notif="New Follower";
        desc= name + " started following you.";
    }
    else if(typeNotif=="post"){
        notif="Group Post";
        desc= name + " posted in a group you follow.";
    }
    else if(typeNotif=="reply"){
        notif="Reply to Your Comment";
        desc= name + " replied to your comment";
    }
    else{
        notif="Filler"
    }
    return (
        <View className="flex-col px-4 mb-2 ml-4 mr-4 rounded-lg p-3">
            <View className="flex-row gap-3 items-start items-center">
                <Image
                    source={icons.profile}
                    className="w-14 h-14"
                    resizeMode="contain"
                />
                <View className="flex-col justify-center">
                    <Text className="font-psemibold text-lg flex-1">
                        {notif}
                    </Text>
                    <Text className="font-pregular text-base text-gray-500 flex-shrink-0">
                        {desc}
                    </Text>
                    <Text className="font-pregular text-sm text-gray-400">
                        {time}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default NotificationCard