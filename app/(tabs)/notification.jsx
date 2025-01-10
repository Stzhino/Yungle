import { SafeAreaView, View, Text, FlatList, ScrollView } from 'react-native'
import React from 'react'
import SearchInput from '../../components/Searchinput'
import NotificationCard from '../../components/NotificationCard'

const Notification = () => {
  return (
    <SafeAreaView className="h-full">
      <View className = "my-6 px-4 space-y-6">
        <SearchInput />
      </View>
      {/* Replace with flatlist after backend is complete */}
      <ScrollView>
        <NotificationCard name="Sally" typeNotif="like" time="now"/>
        <NotificationCard name="Hill" typeNotif="statusupdate" time="4 hours ago"/>
        <NotificationCard name="Jack" typeNotif="reply" time="6 hours ago"/>
        <NotificationCard name="Natalie" typeNotif="follower" time="10 hours ago"/>
        <NotificationCard name="Isaac" typeNotif="comment" time="2 days ago" comment="nice shot!"/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Notification