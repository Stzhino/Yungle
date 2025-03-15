import { useGlobalContext } from "../../context/GlobalProvider"
import { useLocalSearchParams, useRouter } from "expo-router"
import useAppwrite from "../../lib/useAppwrite"
import MessageBubble from "../../components/MessageBubble"
import { getMessages } from "../../lib/appwrite"
import { View,Text,ActivityIndicator,FlatList } from "react-native"
import { useState,useEffect } from "react"
const message = ()=>{
   const {SessionID} = useLocalSearchParams()
   const[isLoading,setIsLoading]= useState(true);
    const {data:messages,refetch}=useAppwrite(()=>getMessages(SessionID))
     const { user, setUser, setIsLogged } = useGlobalContext();
     useEffect(()=>{
      if((messages!=null)&&(messages.length>0)&&(isLoading==true))
      {
      setIsLoading(false);
      }
     },[messages])
return (<View className="flex-1 items-center mt-5">
  {isLoading==true?
  (<ActivityIndicator size="large" color="#0000ff"/>):
  (<FlatList
    data={messages}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => <MessageBubble message={item} />}
    className='w-[90%] mt-10'
          />)
  }
  </View>)
}
export default message