import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { router, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto'
import images from '../constants/images'

import CustomButton from "../components/CustomButton"
import { useGlobalContext } from '@/context/GlobalProvider';

export default function App(){
    const {loading, isLogged} = useGlobalContext();
    if(!loading && isLogged) return <Redirect href="/suggestion"/>
    
    return (
        <SafeAreaView className="bg-black h-full">
            <ScrollView contentContainerStyle={{ height: '100%'}}>
                <View className = "w-full justify-center items-center min-h-[85vh] px-4">
                    <Image 
                        source = {images.logo}
                        className = "w-[250px] h-[250px]"
                        resizeMode="contain"
                    />
                    <View className = "relative pt-16 pb-2">
                    <Text className = "text-3xl text-white font-bold text-center">
                        Change the way you {"\n"} network
                    </Text>
                    </View>
                    <Text className="text-base font-pregular text-gray-500 text-center">
                        Redefining the College Experience
                    </Text>
                    <CustomButton 
                        title="Continue to Sign In"
                        handlePress={()=>router.push('/sign-in')}
                        containerStyles="w-2/3 mt-7 min-h-[62px] bg-primary"
                        textStyles="text-white"
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor='#FFF' style='light'/>
        </SafeAreaView>
    )
}