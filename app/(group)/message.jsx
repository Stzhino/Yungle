
import { useLocalSearchParams, useRouter } from "expo-router"
import { View } from "react-native"
const message = ()=>{
   const {SessionID} = useLocalSearchParams()
   console.log(SessionID)
return <View>
</View>
}
export default message