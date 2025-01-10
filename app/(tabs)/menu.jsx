import { SafeAreaView, View, Text } from 'react-native';
import React from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from "../../components/CustomButton";
import { signOut } from "../../lib/appwrite";
import { router } from "expo-router";

const Menu = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  return (
    <SafeAreaView>
      <CustomButton 
        title="Log Out"
        handlePress={logout}
        containerStyles="w-full mt-7 min-h-[62px] bg-primary"
        textStyles="text-white"
      />
    </SafeAreaView>
  )
}

export default Menu