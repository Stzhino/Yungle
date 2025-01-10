import { View, Text , SafeAreaView, ScrollView, Image, Alert} from 'react-native'
import React, { useState } from 'react'

import images from '../../constants/images'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

import {Link, router} from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async () => {
    if(!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }
    setisSubmitting(true);

    try{
      const result = await createUser(form.email, form.password, form.username);

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
              Sign Up to Yungle
            </Text>
          </View>
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e})}
            otherStyles="mt-10"
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7 min-h-[62px] bg-primary"
            textStyles="text-white"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-pregular">
              Have an account already?
            </Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-primary">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp