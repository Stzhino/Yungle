import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import images from '../../constants/images'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useRouter } from 'expo-router'
import { useSignUpContext } from '../../context/SignUpProvider'

const SignUp = () => {
  const router = useRouter();
  const { form, setForm } = useSignUpContext();
  const [localForm, setLocalForm] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async () => {
    if (!localForm.username || !localForm.email || !localForm.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }
    setisSubmitting(true);

    try {
      setForm({
        name: "",
        school: "",
        major: "",
        career: "",
        interests: "",
        email: localForm.email,
        password: localForm.password,
        username: localForm.username
      });
      router.replace('/signupStep1');
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setisSubmitting(false)
    }
  }
  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView>
        <View className="w-full flex justify-center min-h-[85vh] px-4 my-6">
          <View className="items-center justify-center">
            <Image
              source={images.logo}
              resizeMode='contain'
              className="w-[115px] h-[115px]"
            />
            <Text className="text-2xl text-white text-semibold mt-7 font-psemibold">
              Sign Up to Yungle
            </Text>
          </View>
          <FormField
            title="Username"
            value={localForm.username}
            handleChangeText={(e) => setLocalForm({ ...localForm, username: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={localForm.email}
            handleChangeText={(e) => setLocalForm({ ...localForm, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={localForm.password}
            handleChangeText={(e) => setLocalForm({ ...localForm, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Continue"
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