import { SafeAreaView, View, Text, FlatList } from 'react-native'
import React,{useEffect} from 'react';
import SearchInput from '../../components/Searchinput'
import { getMessages } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import MessageCards from '../../components/MessageCards';
import CustomButton from '../../components/CustomButton';
import {useGlobalContext} from '../../context/GlobalProvider'
import { createNotification } from '../../lib/appwrite';
import { getCurrentUser } from '../../lib/appwrite';
import { useRefetchContext } from '../../context/RefetchProvider';
const Group = () => {
  const{data:messages, refetch}=useAppwrite(getMessages);
    const { user, setUser, setIsLogged } = useGlobalContext();
    const {notifRefetch,setNotifRefetch} =useRefetchContext();
    useEffect(()=>{
        console.log("Creating notif");
        createNotification("Tank",user.avatar,"Message","Hello I am not Hang")
        setNotifRefetch(true);
      },[]); 
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