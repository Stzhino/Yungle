import { View,Text,Image } from "react-native";
const MessageBubble=({message,isConsecutive})=>{
const {time,read,receiver,sender,Message,sessionID}= message;
console.log(time);
const formatedTime = new Date(time).toLocaleDateString("en-US");
return(<View className="w-full flex-row bg-white">
{ !isConsecutive ? 
  (<View className="w-full flex-row mt-4">
    <View className="w-[40px] h-[40px] rounded-full ml-[10px] mt-2 mb-2 overflow-hidden">
              <Image source={{ uri: sender.avatar}} className="w-full h-full" />
    </View>
    <View className="w-full">
        <View className=" flex-row">
            <Text className="ml-5 mt-1 text-[16px] font-pregular">{sender.username}</Text>
            <Text className="ml-5 mt-1 text-[16px] font-pregular">{formatedTime}</Text>
        </View>
        <View className="flex-row w-full">
            <Text className="ml-5 mt-1 text-[16px] font-pregular">{Message}</Text>  
        </View>
    </View>
  </View>
    ):(
    <View className="flex-row w-full">
        <View className="w-[50px]">  

        </View>
        <Text className="ml-5  text-[16px] font-pregular">{Message}</Text>  
    </View>)}
</View>)
}
export default MessageBubble