import { View,Text } from "react-native";
const MessageBubble=(message)=>{
const {times,read,receiver,sender,Message,sessionID}= message;
return(<View className="w-full h-40">
    <View className="h-full w-[50%] bg-red-500">
        <View className="w-16 h-16">

        </View>
    </View>
</View>)
}
export default MessageBubble