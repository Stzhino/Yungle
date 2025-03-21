import { View, Text, ScrollView, TouchableOpacity, Switch, Animated, Image } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const Preferences = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;

  const [preferences, setPreferences] = useState({
    notifications: {
      push: true,
      email: true,
      inApp: true,
      sound: true,
      vibration: true
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: false,
      showReadReceipts: true
    },
    content: {
      autoplay: true,
      dataSaver: false,
      darkMode: false,
      language: 'English'
    }
  });

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

  const PreferenceSection = ({ title, icon, children }) => (
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

  const ToggleOption = ({ title, subtitle, value, onToggle }) => (
    <View className="flex-row items-center justify-between p-3 bg-white/50 rounded-xl mb-2 backdrop-blur-sm">
      <View className="flex-1 mr-4">
        <Text className="font-psemibold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#9902d3' }}
        thumbColor={'#ffffff'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );

  const SelectOption = ({ title, options, selectedOption, onSelect }) => (
    <View className="mb-2">
      <Text className="font-psemibold text-gray-900 mb-2">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            className={`px-4 py-2 rounded-full backdrop-blur-sm ${
              selectedOption === option
                ? 'bg-primary/10 border border-primary/20'
                : 'bg-white/50 border border-white/20'
            }`}
          >
            <Text
              className={`font-psemibold ${
                selectedOption === option
                  ? 'text-primary'
                  : 'text-gray-900'
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
              <Text className="text-3xl font-psemibold text-gray-900">Preferences</Text>
              <Text className="text-base text-gray-500 mt-1">Customize your app experience</Text>
            </Animated.View>
          </View>

          {/* Notification Preferences */}
          <PreferenceSection 
            title="Notifications" 
            icon={<Ionicons name="notifications" size={24} color="#9902d3" />}
          >
            <ToggleOption
              title="Push Notifications"
              subtitle="Receive push notifications on your device"
              value={preferences.notifications.push}
              onToggle={(value) => 
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: value }
                }))
              }
            />
            <ToggleOption
              title="Email Notifications"
              subtitle="Receive important updates via email"
              value={preferences.notifications.email}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: value }
                }))
              }
            />
            <ToggleOption
              title="In-App Notifications"
              subtitle="Show notifications within the app"
              value={preferences.notifications.inApp}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, inApp: value }
                }))
              }
            />
            <ToggleOption
              title="Sound"
              subtitle="Play sound for notifications"
              value={preferences.notifications.sound}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sound: value }
                }))
              }
            />
            <ToggleOption
              title="Vibration"
              subtitle="Vibrate for notifications"
              value={preferences.notifications.vibration}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, vibration: value }
                }))
              }
            />
          </PreferenceSection>

          {/* Privacy Preferences */}
          <PreferenceSection 
            title="Privacy" 
            icon={<Ionicons name="eye" size={24} color="#9902d3" />}
          >
            <ToggleOption
              title="Show Online Status"
              subtitle="Let others see when you're online"
              value={preferences.privacy.showOnlineStatus}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showOnlineStatus: value }
                }))
              }
            />
            <ToggleOption
              title="Show Last Seen"
              subtitle="Let others see when you were last active"
              value={preferences.privacy.showLastSeen}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showLastSeen: value }
                }))
              }
            />
            <ToggleOption
              title="Read Receipts"
              subtitle="Show others when you've read their messages"
              value={preferences.privacy.showReadReceipts}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showReadReceipts: value }
                }))
              }
            />
          </PreferenceSection>

          {/* Content Preferences */}
          <PreferenceSection 
            title="Content & Display" 
            icon={<Ionicons name="settings" size={24} color="#9902d3" />}
          >
            <ToggleOption
              title="Autoplay Media"
              subtitle="Automatically play videos and animations"
              value={preferences.content.autoplay}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  content: { ...prev.content, autoplay: value }
                }))
              }
            />
            <ToggleOption
              title="Data Saver"
              subtitle="Reduce data usage when using the app"
              value={preferences.content.dataSaver}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  content: { ...prev.content, dataSaver: value }
                }))
              }
            />
            <ToggleOption
              title="Dark Mode"
              subtitle="Use dark theme throughout the app"
              value={preferences.content.darkMode}
              onToggle={(value) =>
                setPreferences(prev => ({
                  ...prev,
                  content: { ...prev.content, darkMode: value }
                }))
              }
            />
            <View className="mt-4">
              <SelectOption
                title="Language"
                options={['English', 'Spanish', 'French', 'German']}
                selectedOption={preferences.content.language}
                onSelect={(option) =>
                  setPreferences(prev => ({
                    ...prev,
                    content: { ...prev.content, language: option }
                  }))
                }
              />
            </View>
          </PreferenceSection>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preferences;