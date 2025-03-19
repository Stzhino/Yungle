import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getNotificationPreferences, updateNotificationPreferences } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const NotificationPreferences = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();
  const { data: savedPreferences, refetch } = useAppwrite(() => getNotificationPreferences());
  const [preferences, setPreferences] = useState({
    friendRequests: true,
    messages: true,
    likes: true,
    comments: true,
    position: 'top'
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
    // Fade in animation
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
  }, [savedPreferences]);

  const toggleSwitch = async (key) => {
    try {
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key]
      };
      setPreferences(newPreferences);
      await updateNotificationPreferences(newPreferences);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification preferences');
    }
  };

  const setPosition = async (position) => {
    if (position !== 'top' && position !== 'bottom') {
      Alert.alert('Error', 'Invalid position value');
      return;
    }

    try {
      const newPreferences = {
        ...preferences,
        position
      };
      setPreferences(newPreferences);
      await updateNotificationPreferences(newPreferences);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification position');
    }
  };

  const NotificationOption = ({ title, description, value, onToggle }) => (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
      className="mb-3"
    >
      <View className="flex-row justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <View className="flex-1 mr-4">
          <Text className="font-semibold text-gray-800 text-base">{title}</Text>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#9902d3' }}
          thumbColor={value ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#E5E7EB"
          style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
        />
      </View>
    </Animated.View>
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
        <Text className="text-xl font-bold ml-2 text-gray-800">Notification Settings</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Position Section */}
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
            className="mb-8"
          >
            <Text className="text-lg font-semibold mb-3 text-gray-800">Notification Position</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                onPress={() => setPosition('top')}
                className={`flex-1 py-4 rounded-xl shadow-sm ${preferences.position === 'top' ? 'bg-purple-500' : 'bg-white border border-gray-200'}`}
                style={{ elevation: preferences.position === 'top' ? 2 : 0 }}
              >
                <View className="items-center">
                  <Ionicons 
                    name="arrow-up" 
                    size={24} 
                    color={preferences.position === 'top' ? '#ffffff' : '#6B7280'} 
                  />
                  <Text className={`text-center mt-1 ${preferences.position === 'top' ? 'text-white font-semibold' : 'text-gray-600'}`}>
                    Top
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setPosition('bottom')}
                className={`flex-1 py-4 rounded-xl shadow-sm ${preferences.position === 'bottom' ? 'bg-purple-500' : 'bg-white border border-gray-200'}`}
                style={{ elevation: preferences.position === 'bottom' ? 2 : 0 }}
              >
                <View className="items-center">
                  <Ionicons 
                    name="arrow-down" 
                    size={24} 
                    color={preferences.position === 'bottom' ? '#ffffff' : '#6B7280'} 
                  />
                  <Text className={`text-center mt-1 ${preferences.position === 'bottom' ? 'text-white font-semibold' : 'text-gray-600'}`}>
                    Bottom
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Notification Types Section */}
          <View className="space-y-4">
            <Text className="text-lg font-semibold mb-3 text-gray-800">Notification Types</Text>
            
            <NotificationOption
              title="Friend Requests"
              description="Get notified when someone sends you a friend request"
              value={preferences.friendRequests}
              onToggle={() => toggleSwitch('friendRequests')}
            />

            <NotificationOption
              title="Messages"
              description="Get notified when you receive new messages"
              value={preferences.messages}
              onToggle={() => toggleSwitch('messages')}
            />

            <NotificationOption
              title="Likes"
              description="Get notified when someone likes your post"
              value={preferences.likes}
              onToggle={() => toggleSwitch('likes')}
            />

            <NotificationOption
              title="Comments"
              description="Get notified when someone comments on your post"
              value={preferences.comments}
              onToggle={() => toggleSwitch('comments')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationPreferences