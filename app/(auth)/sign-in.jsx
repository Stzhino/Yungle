import { View, Text , SafeAreaView, ScrollView, Image, Alert} from 'react-native'
import React, { useState } from 'react'

import { router } from 'expo-router'

import images from '../../constants/images'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

import {Link} from 'expo-router'
import { signIn, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setisSubmitting] = useState(false);
  const submit = async () => {
      if(!form.email || !form.password) {
        Alert.alert('Error', 'Please fill in all the fields')
      }
      setisSubmitting(true);
  
      try{
        await signIn(form.email, form.password)
  
        const result = await getCurrentUser();
        setUser(result);
        setIsLogged(true);
  
        router.replace('/suggestion')
      } catch(error){
        Alert.alert('Error', error.message)
      } finally {
        setisSubmitting(false)
      }
    }
  return (
    <SafeAreaView className = "bg-black h-full">
      <ScrollView>
        <View className="w-full flex justify-center min-h-[85vh] px-4 my-6">
          <View className="items-center justify-center">
            <Image 
              source ={images.logo}
              resizeMode='contain'
              className="w-[115px] h-[115px]"
            />
            <Text className="text-2xl text-white text-semibold mt-7 font-psemibold">
              Log in to Yungle
            </Text>
          </View>
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7 min-h-[62px] bg-primary"
            textStyles="text-white"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-primary">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn