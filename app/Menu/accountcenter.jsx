import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Animated, TextInput, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useGlobalContext } from '../../context/GlobalProvider'

const AccountCenter = () => {
  const navigation = useNavigation();
  const { user, setUser } = useGlobalContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const AccountSection = ({ title, icon, children }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
      className="mb-6 bg-white rounded-2xl p-4 shadow-sm"
    >
      <View className="flex-row items-center mb-4">
        <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-3">
          {icon}
        </View>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>
      {children}
    </Animated.View>
  );

  const AccountOption = ({ title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl mb-2"
    >
      <View className="flex-1 mr-4">
        <Text className="font-medium text-gray-800">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="#6D28D9" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-2 text-gray-800">Account Center</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Profile Overview */}
        <AccountSection 
          title="Profile Overview" 
          icon={<Ionicons name="person" size={20} color="#9333EA" />}
        >
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: user?.avatar }}
              className="w-16 h-16 rounded-full bg-gray-200"
            />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-gray-800">{user?.name}</Text>
              <Text className="text-gray-500">{user?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              className="bg-purple-100 p-2 rounded-full"
            >
              <Ionicons name="pencil" size={20} color="#9333EA" />
            </TouchableOpacity>
          </View>
        </AccountSection>

        {/* Security Settings */}
        <AccountSection 
          title="Security" 
          icon={<Ionicons name="shield-checkmark" size={20} color="#9333EA" />}
        >
          <AccountOption
            title="Change Password"
            subtitle="Update your password regularly"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <AccountOption
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            onPress={() => navigation.navigate('2FA')}
            rightElement={
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#E5E7EB', true: '#9333EA' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#E5E7EB"
              />
            }
          />
        </AccountSection>

        {/* Privacy */}
        <AccountSection 
          title="Privacy" 
          icon={<Ionicons name="lock-closed" size={20} color="#9333EA" />}
        >
          <AccountOption
            title="Profile Visibility"
            subtitle="Control who can see your profile"
            onPress={() => navigation.navigate('Privacy')}
          />
          <AccountOption
            title="Blocked Users"
            subtitle="Manage your blocked users list"
            onPress={() => navigation.navigate('BlockedUsers')}
          />
        </AccountSection>

        {/* Account Management */}
        <AccountSection 
          title="Account Management" 
          icon={<Ionicons name="settings" size={20} color="#9333EA" />}
        >
          <AccountOption
            title="Download Your Data"
            subtitle="Get a copy of your data"
            onPress={() => Alert.alert('Download Data', 'This feature will be available soon')}
          />
          <TouchableOpacity
            className="flex-row items-center p-3 bg-red-50 rounded-xl"
            onPress={() => Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {} }
              ]
            )}
          >
            <View className="flex-1">
              <Text className="font-medium text-red-600">Delete Account</Text>
              <Text className="text-red-400 text-sm mt-1">
                Permanently delete your account and data
              </Text>
            </View>
            <Ionicons name="trash-bin" size={20} color="#DC2626" />
          </TouchableOpacity>
        </AccountSection>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountCenter;