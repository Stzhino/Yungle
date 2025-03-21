import { SafeAreaView, View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { signOut } from "../../lib/appwrite";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const Menu = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/(auth)/sign-in");
  };

  const MenuSection = ({ title, children }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 24,
      }}
    >
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#666', 
        marginBottom: 8,
        paddingHorizontal: 20,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        {title}
      </Text>
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
        {children}
      </View>
    </Animated.View>
  );

  const MenuItem = ({ title, subtitle, onPress, isLogout, icon }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}
      activeOpacity={0.7}
    >
      <View style={{ 
        width: 36, 
        height: 36, 
        borderRadius: 12,
        backgroundColor: isLogout ? '#FEE2E2' : '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
      }}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isLogout ? '#EF4444' : '#6B7280'} 
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '600',
          color: isLogout ? '#EF4444' : '#1F2937'
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ 
            fontSize: 13, 
            color: '#6B7280', 
            marginTop: 2 
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      {!isLogout && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView>
        <View style={{ padding: 16, paddingTop: 24 }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: 24,
            paddingHorizontal: 20
          }}>
            Settings
          </Text>

          <MenuSection title="Account">
            <MenuItem 
              title="Account Center"
              subtitle="Password, security, personal details"
              icon="person-circle-outline"
              onPress={() => router.push("/Menu/accountcenter")}
            />
            <MenuItem 
              title="University Hub"
              subtitle="University connection and networking"
              icon="school-outline"
              onPress={() => router.push("/Menu/universityhub")}
            />
          </MenuSection>

          <MenuSection title="Preferences">
            <MenuItem 
              title="Appearance"
              icon="color-palette-outline"
              onPress={() => router.push("/Menu/appearance")}
            />
            <MenuItem 
              title="Notifications"
              icon="notifications-outline"
              onPress={() => router.push("/Menu/notifications")}
            />
            <MenuItem 
              title="Preferences"
              icon="options-outline"
              onPress={() => router.push("/Menu/preferences")}
            />
          </MenuSection>

          <MenuSection title="">
            <MenuItem 
              title="Sign Out"
              icon="log-out-outline"
              onPress={logout}
              isLogout
            />
          </MenuSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;