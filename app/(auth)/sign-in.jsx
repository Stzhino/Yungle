import { View, Text, SafeAreaView, ScrollView, Image, Alert, Animated, Dimensions, KeyboardAvoidingView} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { router } from 'expo-router'
import images from '../../constants/images'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import KeyboardMover from '../../components/KeyboardMover';
import { Link } from 'expo-router'
import { signIn, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setisSubmitting] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
      return;
    }
    setisSubmitting(true);

    try {
      await signIn(form.email, form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      router.replace('/suggestion')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView>
      <SafeAreaView className="h-full">
        <LinearGradient
          colors={['#000000', '#1a0036', '#2a0052']}
          className="absolute w-full h-full"
        />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <Animated.View 
            className="w-full flex justify-center min-h-screen px-6"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View className="items-center justify-center mb-8">
              <Animated.View style={{ transform: [{ scale: logoScale }] }}>
                <Image
                  source={images.logo}
                  resizeMode='contain'
                  className="w-[130px] h-[130px]"
                />
              </Animated.View>
              <Text className="text-3xl text-white font-psemibold mt-8 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-400 text-base font-pregular">
                Log in to continue your journey
              </Text>
            </View>

            <View className="bg-black/30 p-6 rounded-3xl backdrop-blur-lg">
              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mb-5"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mb-6"
                secureTextEntry
              />
              <CustomButton
                title="Sign In"
                handlePress={submit}
                containerStyles="min-h-[56px] bg-primary rounded-xl"
                textStyles="text-white font-psemibold text-lg"
                isLoading={isSubmitting}
              />
            </View>

            <View className="justify-center pt-8 flex-row gap-2">
              <Text className="text-base text-gray-400 font-pregular">
                Don't have an account?
              </Text>
              <Link href="/sign-up" className="text-base font-psemibold text-primary">
                Sign Up
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default SignIn