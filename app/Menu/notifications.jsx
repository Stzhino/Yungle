import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getNotificationPreferences, updateNotificationPreferences } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
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

  useEffect(() => {
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6D28D9" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-4">Notification Settings</Text>
      </View>
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Notification Position</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              onPress={() => setPosition('top')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.position === 'top' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.position === 'top' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Top
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setPosition('bottom')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.position === 'bottom' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.position === 'bottom' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Bottom
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="space-y-4">
          <Text className="text-lg font-semibold mb-3">Notification Types</Text>
          
          <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
            <View>
              <Text className="font-semibold">Friend Requests</Text>
              <Text className="text-gray-500 text-sm">Get notified when someone sends you a friend request</Text>
            </View>
            <Switch
              value={preferences.friendRequests}
              onValueChange={() => toggleSwitch('friendRequests')}
              trackColor={{ false: '#767577', true: '#9902d3' }}
              thumbColor={preferences.friendRequests ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
            <View>
              <Text className="font-semibold">Messages</Text>
              <Text className="text-gray-500 text-sm">Get notified when you receive new messages</Text>
            </View>
            <Switch
              value={preferences.messages}
              onValueChange={() => toggleSwitch('messages')}
              trackColor={{ false: '#767577', true: '#9902d3' }}
              thumbColor={preferences.messages ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
            <View>
              <Text className="font-semibold">Likes</Text>
              <Text className="text-gray-500 text-sm">Get notified when someone likes your post</Text>
            </View>
            <Switch
              value={preferences.likes}
              onValueChange={() => toggleSwitch('likes')}
              trackColor={{ false: '#767577', true: '#9902d3' }}
              thumbColor={preferences.likes ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
            <View>
              <Text className="font-semibold">Comments</Text>
              <Text className="text-gray-500 text-sm">Get notified when someone comments on your post</Text>
            </View>
            <Switch
              value={preferences.comments}
              onValueChange={() => toggleSwitch('comments')}
              trackColor={{ false: '#767577', true: '#9902d3' }}
              thumbColor={preferences.comments ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationPreferences