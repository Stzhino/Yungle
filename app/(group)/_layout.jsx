
import { Stack } from "expo-router"
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const GroupLayout = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return (
        <Stack>
            <Stack.Screen
                name="message"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default GroupLayout