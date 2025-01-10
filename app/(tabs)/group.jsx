import { SafeAreaView, View, Text, FlatList } from 'react-native'
import React from 'react'
import SearchInput from '../../components/Searchinput'
import { getMessages } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import MessageCards from '../../components/MessageCards';

const Group = () => {
  const{data:messages, refetch}=useAppwrite(getMessages);
  return (
    <SafeAreaView className="h-full">
      <View className = "my-6 px-4 space-y-6">
        <SearchInput />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item)=>item.$id}
        renderItem={({item})=>(
          <MessageCards 
            profile={item.sender}
            message={item.Message}
            time={item.time}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Group