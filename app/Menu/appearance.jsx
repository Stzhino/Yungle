import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Appearance = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Temporary state for UI demonstration
  const [preferences, setPreferences] = useState({
    profileStyle: 'grid',
    profilePictureStyle: 'rounded',
    backgroundColor: 'default',
    chatBubbleStyle: 'modern',
    fontStyle: 'system',
    iconPack: 'filled',
    enableAnimations: true
  });

  useEffect(() => {
    // Fade in animation
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

  const PreferenceSection = ({ title, children }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
      className="mb-6 bg-white rounded-2xl p-4 shadow-sm"
    >
      <Text className="text-lg font-semibold text-gray-800 mb-4">{title}</Text>
      {children}
    </Animated.View>
  );

  const StyleOption = ({ title, selected, onPress, icon }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-3 rounded-xl mb-2 ${
        selected ? 'bg-purple-100 border border-purple-200' : 'bg-gray-50'
      }`}
    >
      <View className={`w-8 h-8 rounded-full items-center justify-center ${
        selected ? 'bg-purple-500' : 'bg-gray-200'
      }`}>
        {icon}
      </View>
      <Text className={`ml-3 font-medium ${
        selected ? 'text-purple-700' : 'text-gray-600'
      }`}>
        {title}
      </Text>
      {selected && (
        <View className="ml-auto">
          <Ionicons name="checkmark-circle" size={24} color="#9333EA" />
        </View>
      )}
    </TouchableOpacity>
  );

  const ColorOption = ({ color, selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`w-12 h-12 rounded-full mr-3 ${color} ${
        selected ? 'border-4 border-purple-500' : ''
      }`}
    />
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
        <Text className="text-xl font-bold ml-2 text-gray-800">Appearance Settings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Profile Card Style */}
        <PreferenceSection title="Profile Card Style">
          <StyleOption
            title="Grid View"
            selected={preferences.profileStyle === 'grid'}
            onPress={() => setPreferences(prev => ({ ...prev, profileStyle: 'grid' }))}
            icon={<Ionicons name="grid" size={20} color={preferences.profileStyle === 'grid' ? 'white' : '#6B7280'} />}
          />
          <StyleOption
            title="List View"
            selected={preferences.profileStyle === 'list'}
            onPress={() => setPreferences(prev => ({ ...prev, profileStyle: 'list' }))}
            icon={<Ionicons name="list" size={20} color={preferences.profileStyle === 'list' ? 'white' : '#6B7280'} />}
          />
          <View className="mt-3">
            <Text className="font-medium text-gray-700 mb-2">Profile Picture Style</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setPreferences(prev => ({ ...prev, profilePictureStyle: 'rounded' }))}
                className={`w-16 h-16 rounded-full bg-gray-200 mr-4 ${
                  preferences.profilePictureStyle === 'rounded' ? 'border-4 border-purple-500' : ''
                }`}
              />
              <TouchableOpacity
                onPress={() => setPreferences(prev => ({ ...prev, profilePictureStyle: 'square' }))}
                className={`w-16 h-16 rounded-lg bg-gray-200 ${
                  preferences.profilePictureStyle === 'square' ? 'border-4 border-purple-500' : ''
                }`}
              />
            </View>
          </View>
        </PreferenceSection>

        {/* Background Customization */}
        <PreferenceSection title="Background Theme">
          <Text className="font-medium text-gray-700 mb-3">Color Palette</Text>
          <View className="flex-row mb-4">
            <ColorOption
              color="bg-white"
              selected={preferences.backgroundColor === 'default'}
              onPress={() => setPreferences(prev => ({ ...prev, backgroundColor: 'default' }))}
            />
            <ColorOption
              color="bg-purple-100"
              selected={preferences.backgroundColor === 'purple'}
              onPress={() => setPreferences(prev => ({ ...prev, backgroundColor: 'purple' }))}
            />
            <ColorOption
              color="bg-blue-100"
              selected={preferences.backgroundColor === 'blue'}
              onPress={() => setPreferences(prev => ({ ...prev, backgroundColor: 'blue' }))}
            />
            <ColorOption
              color="bg-green-100"
              selected={preferences.backgroundColor === 'green'}
              onPress={() => setPreferences(prev => ({ ...prev, backgroundColor: 'green' }))}
            />
          </View>
        </PreferenceSection>

        {/* Chat Bubble Style */}
        <PreferenceSection title="Chat Bubble Style">
          <StyleOption
            title="Modern Rounded"
            selected={preferences.chatBubbleStyle === 'modern'}
            onPress={() => setPreferences(prev => ({ ...prev, chatBubbleStyle: 'modern' }))}
            icon={<MaterialCommunityIcons name="message-text" size={20} color={preferences.chatBubbleStyle === 'modern' ? 'white' : '#6B7280'} />}
          />
          <StyleOption
            title="Classic Square"
            selected={preferences.chatBubbleStyle === 'classic'}
            onPress={() => setPreferences(prev => ({ ...prev, chatBubbleStyle: 'classic' }))}
            icon={<MaterialCommunityIcons name="message" size={20} color={preferences.chatBubbleStyle === 'classic' ? 'white' : '#6B7280'} />}
          />
          <StyleOption
            title="Bubble Style"
            selected={preferences.chatBubbleStyle === 'bubble'}
            onPress={() => setPreferences(prev => ({ ...prev, chatBubbleStyle: 'bubble' }))}
            icon={<MaterialCommunityIcons name="message-outline" size={20} color={preferences.chatBubbleStyle === 'bubble' ? 'white' : '#6B7280'} />}
          />
        </PreferenceSection>

        {/* Font Style */}
        <PreferenceSection title="Font & Text Style">
          <StyleOption
            title="System Default"
            selected={preferences.fontStyle === 'system'}
            onPress={() => setPreferences(prev => ({ ...prev, fontStyle: 'system' }))}
            icon={<Ionicons name="text" size={20} color={preferences.fontStyle === 'system' ? 'white' : '#6B7280'} />}
          />
          <StyleOption
            title="Professional"
            selected={preferences.fontStyle === 'professional'}
            onPress={() => setPreferences(prev => ({ ...prev, fontStyle: 'professional' }))}
            icon={<Ionicons name="business" size={20} color={preferences.fontStyle === 'professional' ? 'white' : '#6B7280'} />}
          />
          <StyleOption
            title="Casual"
            selected={preferences.fontStyle === 'casual'}
            onPress={() => setPreferences(prev => ({ ...prev, fontStyle: 'casual' }))}
            icon={<Ionicons name="happy" size={20} color={preferences.fontStyle === 'casual' ? 'white' : '#6B7280'} />}
          />
        </PreferenceSection>

        {/* Icon Pack Style */}
        <PreferenceSection title="Icon Pack & Button Style">
          <StyleOption
            title="Filled Icons"
            selected={preferences.iconPack === 'filled'}
            onPress={() => setPreferences(prev => ({ ...prev, iconPack: 'filled' }))}
            icon={<Ionicons name="apps" size={20} color={preferences.iconPack === 'filled' ? 'white' : '#6B7280'} />}
          />
          <StyleOption
            title="Outlined Icons"
            selected={preferences.iconPack === 'outlined'}
            onPress={() => setPreferences(prev => ({ ...prev, iconPack: 'outlined' }))}
            icon={<Ionicons name="apps-outline" size={20} color={preferences.iconPack === 'outlined' ? 'white' : '#6B7280'} />}
          />
        </PreferenceSection>

        {/* Animation Preferences */}
        <PreferenceSection title="Animation Preferences">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-medium text-gray-800">Enable Animations</Text>
              <Text className="text-gray-500 text-sm">Smooth transitions and effects</Text>
            </View>
            <Switch
              value={preferences.enableAnimations}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, enableAnimations: value }))}
              trackColor={{ false: '#E5E7EB', true: '#9333EA' }}
              thumbColor={preferences.enableAnimations ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </PreferenceSection>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appearance;