import { View, Text, SafeAreaView, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import images from '../../constants/images';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';
import { useSignUpContext } from '../../context/SignUpProvider';
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from "@react-navigation/native";
import KeyboardMover from '../../components/KeyboardMover';

const SignupStep3 = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const { form } = useSignUpContext();
    const { setUser, setIsLogged } = useGlobalContext();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await createUser(form.email, form.password, form.username, {
                name: form.name,
                school: form.school,
                major: form.major,
                career: form.career,
            });

            setUser(result);
            setIsLogged(true);
            router.replace("/profile");
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardMover>
            <SafeAreaView className="bg-black h-full">
                <ScrollView>
                    <View className="w-full flex justify-center items-center min-h-[85vh] px-6 my-6">

                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            className="w-[120px] h-[120px]"
                        />

                        <Text className="text-3xl text-white font-bold mt-6">
                            Finalize Your Profile
                        </Text>

                        <View className="mt-8 w-full space-y-5">
                            {[
                                { label: "Username", value: form.username },
                                { label: "Email", value: form.email },
                                { label: "School", value: form.school },
                                { label: "Major", value: form.major },
                                { label: "Career", value: form.career },
                                ...(Array.isArray(form.interests) && form.interests.length > 0
                                    ? [{ label: "Interests", value: form.interests.join(", ") }]
                                    : [])
                            ].map((item, index) => (
                                <View key={index} className="w-full">
                                    <Text className="text-base text-gray-400 tracking-wide">{item.label}</Text>
                                    <Text className="text-xl text-white font-medium">
                                        {item.value || "N/A"}
                                    </Text>
                                    {index !== 5 && <View className="border-b border-gray-700 mt-3" />}
                                </View>
                            ))}
                        </View>


                        <CustomButton
                            title="Finish"
                            handlePress={handleSubmit}
                            containerStyles="mt-10 min-h-[56px] bg-primary w-3/4 rounded-lg shadow-lg"
                            textStyles="text-white text-lg font-semibold"
                            isLoading={isSubmitting}
                        />

                        <TouchableOpacity onPress={() => router.back()} className="mt-5">
                            <Text className="text-lg text-gray-400 text-center">Previous</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardMover>
    );
};

export default SignupStep3;
