import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../../constants/images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';
import { useSignUpContext } from '../../context/SignUpProvider';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const SignupStep2 = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const router = useRouter();
    const { form, setForm } = useSignUpContext();
    const [localForm, setLocalForm] = useState({
        major: form.major || "",
        career: form.career || "",
    });

    const submit = () => {
        if (!localForm.major || !localForm.career) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setForm({ ...form, ...localForm });
        router.push('/signupStep3');
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
                            Professional Info
                        </Text>
                    </View>

                    <FormField
                        title="Select Major"
                        value={localForm.major}
                        handleChangeText={(e) => setLocalForm({ ...localForm, major: e })}
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="Enter Career"
                        value={localForm.career}
                        handleChangeText={(e) => setLocalForm({ ...localForm, career: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Next"
                        handlePress={submit}
                        containerStyles="mt-7 min-h-[62px] bg-primary"
                        textStyles="text-white"
                    />

                    <TouchableOpacity onPress={() => router.back()} className="mt-5">
                        <Text className="text-lg text-gray-400 text-center">Previous</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignupStep2;
