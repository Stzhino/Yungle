import { View, Text, SafeAreaView, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import images from '../../constants/images';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';
import { useSignUpContext } from '../../context/SignUpProvider';
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignupStep3 = () => {
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
                //interests: form.interests,
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
        <SafeAreaView className="bg-black h-full">
            <ScrollView>
                <View className="w-full flex justify-center min-h-[85vh] px-4 my-6">
                    <View className="items-center justify-center">
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            className="w-[115px] h-[115px]"
                        />
                        <Text className="text-2xl text-white font-semibold mt-7">
                            Finalize Your Profile
                        </Text>
                    </View>

                    <View className="bg-gray-800 p-5 rounded-lg mt-10">
                        <Text className="text-white text-lg font-semibold">Review Your Details</Text>
                        <Text className="text-gray-300 mt-2">Username: {form.username}</Text>
                        <Text className="text-gray-300 mt-1">Email: {form.email}</Text>
                        <Text className="text-gray-300 mt-1">School: {form.school}</Text>
                        <Text className="text-gray-300 mt-1">Major: {form.major}</Text>
                        <Text className="text-gray-300 mt-1">Career: {form.career}</Text>
                        <Text className="text-gray-300 mt-1">Interests: {form.interests || "None"}</Text>
                    </View>

                    <CustomButton
                        title="Finish"
                        handlePress={handleSubmit}
                        containerStyles="mt-7 min-h-[62px] bg-primary"
                        textStyles="text-white"
                        isLoading={isSubmitting}
                    />

                    <TouchableOpacity onPress={() => router.back()} className="mt-5">
                        <Text className="text-lg text-gray-400 text-center">Previous</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignupStep3;
