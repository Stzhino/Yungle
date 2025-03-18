import { useGlobalContext } from "../../context/GlobalProvider"
import { useLocalSearchParams, useRouter } from "expo-router"
import useAppwrite from "../../lib/useAppwrite"
import MessageBubble from "../../components/MessageBubble"
import { getMessages } from "../../lib/appwrite"
import { View,Text,ActivityIndicator,FlatList,TextInput } from "react-native"
import { useState,useEffect,useRef } from "react"
const message = ()=>{
   const {SessionID} = useLocalSearchParams()
   const[isLoading,setIsLoading]= useState(true);
    const {data:messages,refetch}=useAppwrite(()=>getMessages(SessionID))
     const { user, setUser, setIsLogged } = useGlobalContext();
     const previousUserRef=useRef(null);
     useEffect(()=>{
      if((messages!=null)&&(messages.length>0)&&(isLoading==true))
      {
      setIsLoading(false);
      }
     },[messages])
return (<View className="flex-1 items-center bg-white">
  {isLoading==true?
  (<ActivityIndicator size="large" color="#0000ff"/>
  ):(
  <View className="w-[95%] flex-col">
    <FlatList
    data={messages}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => {
      const isConsecutiveMessage = previousUserRef.current?.sender.username==item.sender.username
      console.log(isConsecutiveMessage);
      previousUserRef.current=item
    return <MessageBubble message={item} isConsecutive={isConsecutiveMessage}/>
  }} className='w-[90%] mt-10'/>
  </View>)}
  </View>)
}
export default message