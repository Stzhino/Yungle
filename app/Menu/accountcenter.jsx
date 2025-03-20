import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Animated, TextInput, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useGlobalContext } from '../../context/GlobalProvider'
import { LinearGradient } from 'expo-linear-gradient'

const AccountCenter = () => {
  const navigation = useNavigation();
  const { user, setUser } = useGlobalContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;

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
      Animated.spring(headerScale, {
        toValue: 1,
        friction: 8,
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
      className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/20"
    >
      <LinearGradient
        colors={['rgba(153, 2, 211, 0.1)', 'rgba(153, 2, 211, 0.05)']}
        className="absolute inset-0 rounded-2xl"
      />
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-3 backdrop-blur-sm">
          {icon}
        </View>
        <Text className="text-lg font-psemibold text-gray-900">{title}</Text>
      </View>
      {children}
    </Animated.View>
  );

  const AccountOption = ({ title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-3 bg-white/50 rounded-xl mb-2 backdrop-blur-sm"
    >
      <View className="flex-1 mr-4">
        <Text className="font-psemibold text-gray-900">{title}</Text>
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
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#f8f9fa', '#f1f3f5']}
        className="absolute inset-0"
      />
      <ScrollView className="flex-1">
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="p-4"
        >
          {/* Header with Back Button */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="mr-4"
            >
              <Image 
                source={require('../../assets/icons/leftArrow.png')}
                className="w-6 h-6" 
                resizeMode='contain'
                style={{ tintColor: '#9902d3' }}
              />
            </TouchableOpacity>
            <Animated.View 
              style={{ transform: [{ scale: headerScale }] }}
              className="flex-1"
            >
              <Text className="text-3xl font-psemibold text-gray-900">Account Center</Text>
              <Text className="text-base text-gray-500 mt-1">Manage your account settings</Text>
            </Animated.View>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Profile Overview */}
            <AccountSection 
              title="Profile Overview" 
              icon={<Ionicons name="person" size={24} color="#9902d3" />}
            >
              <View className="flex-row items-center mb-4">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-16 h-16 rounded-full bg-gray-200"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-psemibold text-gray-900">{user?.name}</Text>
                  <Text className="text-gray-500">{user?.email}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile')}
                  className="bg-primary/10 p-3 rounded-xl backdrop-blur-sm"
                >
                  <Ionicons name="pencil" size={20} color="#9902d3" />
                </TouchableOpacity>
              </View>
            </AccountSection>

            {/* Security Settings */}
            <AccountSection 
              title="Security" 
              icon={<Ionicons name="shield-checkmark" size={24} color="#9902d3" />}
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
                    trackColor={{ false: '#E5E7EB', true: '#9902d3' }}
                    thumbColor={'#ffffff'}
                    ios_backgroundColor="#E5E7EB"
                  />
                }
              />
            </AccountSection>

            {/* Privacy */}
            <AccountSection 
              title="Privacy" 
              icon={<Ionicons name="lock-closed" size={24} color="#9902d3" />}
            >
              <AccountOption
                title="Profile Visibility"
                subtitle="Control who can see your profile"
                onPress={() => navigation.navigate('Privacy')}
              />
              <AccountOption
                title="Activity Status"
                subtitle="Manage your online presence"
                onPress={() => navigation.navigate('ActivityStatus')}
              />
              <AccountOption
                title="Data Sharing"
                subtitle="Control how your data is used"
                onPress={() => navigation.navigate('DataSharing')}
              />
            </AccountSection>

            {/* Account Management */}
            <AccountSection 
              title="Account Management" 
              icon={<Ionicons name="settings" size={24} color="#9902d3" />}
            >
              <AccountOption
                title="Download Your Data"
                subtitle="Get a copy of your data"
                onPress={() => Alert.alert('Download Data', 'This feature will be available soon')}
              />
              <TouchableOpacity
                className="flex-row items-center p-3 bg-red-50/80 rounded-xl backdrop-blur-sm"
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
                  <Text className="font-psemibold text-red-600">Delete Account</Text>
                  <Text className="text-red-400 text-sm mt-1">
                    Permanently delete your account and data
                  </Text>
                </View>
                <Ionicons name="trash-bin" size={20} color="#DC2626" />
              </TouchableOpacity>
            </AccountSection>
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountCenter;