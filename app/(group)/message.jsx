import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";
import { getMessages, createMessage } from "../../lib/appwrite";
import { View, Text, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const MessageScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { SessionID } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { data: messages, refetch } = useAppwrite(() => getMessages(SessionID));
  const { user } = useGlobalContext();
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const flatListRef = useRef(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (!SessionID) {
      console.error("SessionID is missing");
      return;
    }

    if (messages && messages.length > 0 && isLoading) {
      setChatMessages(messages);
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
  (<ActivityIndicator size="large" color="#0000ff"/>
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
  }} className='w-[90%]'/>
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