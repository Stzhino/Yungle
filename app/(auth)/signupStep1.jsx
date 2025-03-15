import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../../constants/images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';
import { useSignUpContext } from '../../context/SignUpProvider';
import { useNavigation } from "@react-navigation/native";

const SignupStep1 = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const router = useRouter();
    const { form, setForm } = useSignUpContext();
    const [localForm, setLocalForm] = useState({
        name: form.name || "",
        school: form.school || "",
    });

    const submit = () => {
        if (!localForm.name || !localForm.school) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setForm({ ...form, ...localForm });
        router.push('/signupStep2');
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
                            Setup Your Profile
                        </Text>
                    </View>

                    <FormField
                        title="Full Name"
                        value={localForm.name}
                        handleChangeText={(e) => setLocalForm({ ...localForm, name: e })}
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="School / University"
                        value={localForm.school}
                        handleChangeText={(e) => setLocalForm({ ...localForm, school: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Next"
                        handlePress={submit}
                        containerStyles="mt-7 min-h-[62px] bg-primary"
                        textStyles="text-white"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignupStep1;
