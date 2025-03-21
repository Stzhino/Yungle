import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Alert, Animated, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getNotificationPreferences, updateNotificationPreferences } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

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
  const headerScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
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
      <View className="flex-row justify-between items-center p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/20">
        <LinearGradient
          colors={['rgba(153, 2, 211, 0.1)', 'rgba(153, 2, 211, 0.05)']}
          className="absolute inset-0 rounded-xl"
        />
        <View className="flex-1 mr-4">
          <Text className="font-psemibold text-gray-900 text-base">{title}</Text>
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
              <Text className="text-3xl font-psemibold text-gray-900">Notifications</Text>
              <Text className="text-base text-gray-500 mt-1">Manage your notification preferences</Text>
            </Animated.View>
          </View>

          {/* Position Section */}
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
            className="mb-8"
          >
            <Text className="text-lg font-psemibold mb-3 text-gray-900">Notification Position</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                onPress={() => setPosition('top')}
                className={`flex-1 py-4 rounded-xl backdrop-blur-sm ${
                  preferences.position === 'top' 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-white/50 border border-white/20'
                }`}
              >
                <View className="items-center">
                  <Ionicons 
                    name="arrow-up" 
                    size={24} 
                    color={preferences.position === 'top' ? '#9902d3' : '#6B7280'} 
                  />
                  <Text className={`text-center mt-1 font-psemibold ${
                    preferences.position === 'top' ? 'text-primary' : 'text-gray-600'
                  }`}>
                    Top
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setPosition('bottom')}
                className={`flex-1 py-4 rounded-xl backdrop-blur-sm ${
                  preferences.position === 'bottom' 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-white/50 border border-white/20'
                }`}
              >
                <View className="items-center">
                  <Ionicons 
                    name="arrow-down" 
                    size={24} 
                    color={preferences.position === 'bottom' ? '#9902d3' : '#6B7280'} 
                  />
                  <Text className={`text-center mt-1 font-psemibold ${
                    preferences.position === 'bottom' ? 'text-primary' : 'text-gray-600'
                  }`}>
                    Bottom
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Notification Types Section */}
          <View className="space-y-4">
            <Text className="text-lg font-psemibold mb-3 text-gray-900">Notification Types</Text>
            
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
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationPreferences;