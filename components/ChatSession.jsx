import { View,TouchableOpacity,Image,Text } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { calculateTimeDifference } from '../lib/calculation';
const ChatSession = ({session})=>{
   const {title, PersonA,PersonAProfile,PersonB,PersonBProfile,recentMessage,messageSender,messageDate} = session
    const { user, setUser, setIsLogged } = useGlobalContext();
    let recipientProfile = user.username=PersonA ? PersonBProfile : PersonAProfile;
    const router = useRouter();
    console.log(`SessionID:${session.$id}`)
    const timeDifference = calculateTimeDifference(messageDate)
     return(
        <View className="flex-row border-t-[1px] border-[#F2F2F2] self-center p-2">
            <View className="w-[60px] h-[60px] rounded-full ml-[10px] overflow-hidden">
                <Image source={{ uri: recipientProfile }} className="w-full h-full" />
            </View>
            <TouchableOpacity onPress={()=>{
                router.push({
                    pathname:"/(group)/message",
                    params:{SessionID:session.$id}
                    })
                }} 
                className="ml-5 w-[80%] h-70">
                <View className="flex-row ">
                <Text className="font-bold text-[16px] ">{title}</Text>
                <Text className="text-[15px] text-gray-500 ml-20">{timeDifference}</Text>
                </View>
                <Text className="text-[black] mt-3">{messageSender}: {recentMessage}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default ChatSession