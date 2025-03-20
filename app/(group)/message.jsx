import { useGlobalContext } from "../../context/GlobalProvider"
import { useLocalSearchParams, useRouter } from "expo-router"
import useAppwrite from "../../lib/useAppwrite"
import MessageBubble from "../../components/MessageBubble"
import { getMessages } from "../../lib/appwrite"
import icons from "../../constants/icons"
import SearchBar from "../../components/SearchBar"
import KeyboardMover from "../../components/KeyboardMover"
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view"
import { View,Text,ActivityIndicator,FlatList,TextInput, TouchableOpacity,Image,Platform,KeyboardAvoidingView } from "react-native"
import { useState,useEffect,useRef } from "react"
const message = ()=>{
   const {SessionID} = useLocalSearchParams()
   const[isLoading,setIsLoading]= useState(true);
    const {data:messages,refetch}=useAppwrite(()=>getMessages(SessionID))
     const { user, setUser, setIsLogged } = useGlobalContext();
     const previousUserRef=useRef(null);
     const flatListRef = useRef(null);
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
return (<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"} 
  keyboardVerticalOffset={Platform.OS === "ios" ? 60:0}
  style={{ flex: 1 }}
>
<View className="flex-1 items-center bg-white">
  {isLoading==true?
  (
  <View className="flex-1 item-center justify-center"><ActivityIndicator size="large" color="#0000ff"/></View>
  ):(
<View className="flex-1 bg-purple-500">
  <View className="w-full h-[80%] ">
    <FlatList
    ref={flatListRef}
    data={messages}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => {
      const isConsecutiveMessage = previousUserRef.current?.sender.username==item.sender.username
      console.log(isConsecutiveMessage);
      previousUserRef.current=item
    return <MessageBubble message={item} isConsecutive={isConsecutiveMessage}/>
  }} className='w-[90%] mt-20'/>
  </View>
  <View className="w-[90%] h-[8%] flex-row mt-4 flex-row items-center bg-[#F0F0F0] border-2 border-[#E0E0E0] p-1 rounded-2xl">
    <TextInput 
      className=" text-[16px] font-pregular flex-1"
      onChangeText={(e)=>{messageFunct(e)}}
      value={userMessage}
      placeholder="Enter an message"
      onFocus={()=>setShowSubmit(true)}
      onBlur={()=>{setShowSubmit(false)}}
       />
       <TouchableOpacity style={{opacity:showSubmit?1:0}}onPress={()=>{}}>
           <Image
              source = {icons.search}
              className='w-6 h-6'
              resizeMode='contain'
                      />
       </TouchableOpacity>
  </View>
</View>
)}
  </View></KeyboardAvoidingView>)
}
export default message