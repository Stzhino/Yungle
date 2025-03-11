
import { useLocalSearchParams, useRouter } from "expo-router"
import { View } from "react-native"
const message = ()=>{
   const {sessionID} = useLocalSearchParams()
   console.log(sessionID)
return <View>
</View>
}
export default message