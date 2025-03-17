import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const Preferences = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState({
    language: 'en',
    countryRegion: 'US',
    darkMode: false,
    fontSize: 'medium',
  });

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
   // console.log('Preferences to save:', preferences);
    //Alert.alert('Success', 'Preferences saved successfully!');
    navigation.goBack(); 
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6D28D9" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-4">Preferences</Text>
      </View>

      <ScrollView className="flex-1 px-4">
      

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Language</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => updatePreference('language', 'en')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.language === 'en' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.language === 'en' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updatePreference('language', 'es')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.language === 'es' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.language === 'es' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Spanish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Country/Region</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => updatePreference('countryRegion', 'US')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.countryRegion === 'US' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.countryRegion === 'US' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                United States
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updatePreference('countryRegion', 'CA')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.countryRegion === 'CA' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.countryRegion === 'CA' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Canada
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
          <View>
            <Text className="font-semibold">Dark Mode</Text>
            <Text className="text-gray-500 text-sm">Enable dark mode for better night-time viewing</Text>
          </View>
          <Switch
            value={preferences.darkMode}
            onValueChange={() => updatePreference('darkMode', !preferences.darkMode)}
            trackColor={{ false: '#767577', true: '#9902d3' }}
            thumbColor={preferences.darkMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Font Size</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => updatePreference('fontSize', 'small')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.fontSize === 'small' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.fontSize === 'small' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Small
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updatePreference('fontSize', 'medium')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.fontSize === 'medium' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.fontSize === 'medium' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updatePreference('fontSize', 'large')}
              className={`flex-1 p-4 rounded-lg border-2 ${preferences.fontSize === 'large' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${preferences.fontSize === 'large' ? 'text-purple-500 font-semibold' : 'text-gray-600'}`}>
                Large
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-purple-500 p-4 rounded-lg mt-6 mb-8"
        >
          <Text className="text-white text-center font-semibold">Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preferences;