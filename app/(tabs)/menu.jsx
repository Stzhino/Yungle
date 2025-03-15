import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { signOut } from "../../lib/appwrite";
import { router } from "expo-router";

const Menu = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/(auth)/sign-in");
  };

  const MenuItem = ({ title, subtitle, onPress, isLogout }) => (
    <TouchableOpacity onPress={onPress} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingLeft: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: isLogout ? 'bold' : '600', color: isLogout ? 'red' : 'black' }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 }}>Menu</Text>
      <View>
        <MenuItem 
          title="Account Center"
          subtitle="Password, security, personal details"
          onPress={() => router.push("/Menu/accountcenter")}
        />
        <MenuItem 
          title="University Hub"
          subtitle="University connection and networking"
          onPress={() => router.push("/Menu/universityhub")}
        />
        <MenuItem 
          title="Appearance"
          onPress={() => router.push("/Menu/appearance")}
        />
        <MenuItem 
          title="Notifications"
          onPress={() => router.push("/Menu/notifications")}
        />
        <MenuItem 
          title="Blocked Users"
          onPress={() => router.push("/Menu/blockedusers")}
        />
        <MenuItem 
          title="Preferences"
          onPress={() => router.push("/Menu/preferences")}
        />
        <MenuItem 
          title="Sign Out"
          onPress={logout}
          isLogout
        />
      </View>
    </SafeAreaView>
  );
};

export default Menu;