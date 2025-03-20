
import { Stack } from "expo-router"
const GroupLayout=()=>{
return <Stack
screenOptions={{
    headerShown: false
  }}>
    <Stack.Screen 
    name="message" 
    options={{
        header: () => null// Optionally, you can explicitly set the title to an empty string to prevent the folder name from showing up
      }}
    />
</Stack>
}

export default GroupLayout