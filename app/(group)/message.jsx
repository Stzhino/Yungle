import { useGlobalContext } from "../../context/GlobalProvider"
import { useLocalSearchParams, useRouter } from "expo-router"
import useAppwrite from "../../lib/useAppwrite"
import MessageBubble from "../../components/MessageBubble"
import { getMessages } from "../../lib/appwrite"
import icons from "../../constants/icons"
import SearchBar from "../../components/SearchBar"
import KeyboardMover from "../../components/KeyboardMover"
import { View,Text,ActivityIndicator,FlatList,TextInput, TouchableOpacity,Image } from "react-native"
import { useState,useEffect,useRef } from "react"
const message = ()=>{
   const {SessionID} = useLocalSearchParams()
   const[isLoading,setIsLoading]= useState(true);
    const {data:messages,refetch}=useAppwrite(()=>getMessages(SessionID))
     const { user, setUser, setIsLogged } = useGlobalContext();
     const previousUserRef=useRef(null);
     const[showSubmit, setShowSubmit] =useState(false);
     const[userMessage,setUserMessage]=useState("")
     previousUserRef.current=null;
     const messageFunct=(e)=>{
    setUserMessage(e)
     }
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
<View className="flex-1 bg-blue-500">
  <View className="w-full h-[80%] ">
    <FlatList
    data={messages}
    keyExtractor={(item, index) => index.toString()}
    nestedScrollEnabled={true}
    renderItem={({ item }) => {
      const isConsecutiveMessage = previousUserRef.current?.sender.username==item.sender.username
      console.log(isConsecutiveMessage);
      previousUserRef.current=item
    return <MessageBubble message={item} isConsecutive={isConsecutiveMessage}/>
  }} className='w-[90%] mt-10'/>
  </View>
  <View className="w-[90%] h-[10%] flex-row mt-4 flex-row items-center bg-[#F0F0F0] border-2 border-[#E0E0E0] p-1 rounded-2xl">
    <TextInput 
      className=" text-[16px] font-pregular flex-1"
      onChangeText={(e)=>{messageFunct(e)}}
      value={userMessage}
      placeholder="Enter an message"
      onFocus={()=>setShowSubmit(true)}
       />
       <TouchableOpacity style={{opacity:showSubmit?1:1}}onPress={()=>{}}>
           <Image
              source = {icons.search}
              className='w-6 h-6'
              resizeMode='contain'
                      />
       </TouchableOpacity>
  </View>
</View>
)}
  </View>)
}
export default message