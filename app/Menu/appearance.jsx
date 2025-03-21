import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const Appearance = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;

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

  const PreferenceSection = ({ title, children }) => (
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
      <Text className="text-lg font-psemibold text-gray-900 mb-4">{title}</Text>
      {children}
    </Animated.View>
  );

  const StyleOption = ({ title, selected, onPress, icon }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-3 rounded-xl mb-2 backdrop-blur-sm ${
        selected ? 'bg-primary/10 border border-primary/20' : 'bg-white/50'
      }`}
    >
      <View className={`w-10 h-10 rounded-xl items-center justify-center ${
        selected ? 'bg-primary/20' : 'bg-gray-100'
      }`}>
        {icon}
      </View>
      <Text className={`ml-3 font-psemibold ${
        selected ? 'text-primary' : 'text-gray-900'
      }`}>
        {title}
      </Text>
      {selected && (
        <View className="ml-auto">
          <Ionicons name="checkmark-circle" size={24} color="#9902d3" />
        </View>
      )}
    </TouchableOpacity>
  );

  const ColorOption = ({ color, selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`w-12 h-12 rounded-full mr-3 ${color} ${
        selected ? 'border-4 border-primary' : ''
      }`}
    />
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
              <Text className="text-3xl font-psemibold text-gray-900">Appearance</Text>
              <Text className="text-base text-gray-500 mt-1">Customize your app experience</Text>
            </Animated.View>
          </View>

          {/* Profile Card Style */}
          <PreferenceSection title="Profile Card Style">
            <StyleOption
              title="Grid View"
              selected={preferences.profileStyle === 'grid'}
              onPress={() => setPreferences(prev => ({ ...prev, profileStyle: 'grid' }))}
              icon={<Ionicons name="grid" size={24} color={preferences.profileStyle === 'grid' ? '#9902d3' : '#6B7280'} />}
            />
            <StyleOption
              title="List View"
              selected={preferences.profileStyle === 'list'}
              onPress={() => setPreferences(prev => ({ ...prev, profileStyle: 'list' }))}
              icon={<Ionicons name="list" size={24} color={preferences.profileStyle === 'list' ? '#9902d3' : '#6B7280'} />}
            />
            <View className="mt-3">
              <Text className="font-psemibold text-gray-900 mb-2">Profile Picture Style</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setPreferences(prev => ({ ...prev, profilePictureStyle: 'rounded' }))}
                  className={`w-16 h-16 rounded-full bg-gray-200 mr-4 ${
                    preferences.profilePictureStyle === 'rounded' ? 'border-4 border-primary' : ''
                  }`}
                />
                <TouchableOpacity
                  onPress={() => setPreferences(prev => ({ ...prev, profilePictureStyle: 'square' }))}
                  className={`w-16 h-16 rounded-lg bg-gray-200 ${
                    preferences.profilePictureStyle === 'square' ? 'border-4 border-primary' : ''
                  }`}
                />
              </View>
            </View>
          </PreferenceSection>

          {/* Background Customization */}
          <PreferenceSection title="Background Theme">
            <Text className="font-psemibold text-gray-900 mb-3">Color Palette</Text>
            <View className="flex-row mb-4">
              <ColorOption
                color="bg-white"
                selected={preferences.backgroundColor === 'default'}
                onPress={() => setPreferences(prev => ({ ...prev, backgroundColor: 'default' }))}
              />
              <ColorOption
                color="bg-primary/10"
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
              icon={<MaterialCommunityIcons name="message-text" size={24} color={preferences.chatBubbleStyle === 'modern' ? '#9902d3' : '#6B7280'} />}
            />
            <StyleOption
              title="Classic Square"
              selected={preferences.chatBubbleStyle === 'classic'}
              onPress={() => setPreferences(prev => ({ ...prev, chatBubbleStyle: 'classic' }))}
              icon={<MaterialCommunityIcons name="message" size={24} color={preferences.chatBubbleStyle === 'classic' ? '#9902d3' : '#6B7280'} />}
            />
            <StyleOption
              title="Bubble Style"
              selected={preferences.chatBubbleStyle === 'bubble'}
              onPress={() => setPreferences(prev => ({ ...prev, chatBubbleStyle: 'bubble' }))}
              icon={<MaterialCommunityIcons name="message-outline" size={24} color={preferences.chatBubbleStyle === 'bubble' ? '#9902d3' : '#6B7280'} />}
            />
          </PreferenceSection>

          {/* Font Style */}
          <PreferenceSection title="Font & Text Style">
            <StyleOption
              title="System Default"
              selected={preferences.fontStyle === 'system'}
              onPress={() => setPreferences(prev => ({ ...prev, fontStyle: 'system' }))}
              icon={<Ionicons name="text" size={24} color={preferences.fontStyle === 'system' ? '#9902d3' : '#6B7280'} />}
            />
            <StyleOption
              title="Professional"
              selected={preferences.fontStyle === 'professional'}
              onPress={() => setPreferences(prev => ({ ...prev, fontStyle: 'professional' }))}
              icon={<Ionicons name="business" size={24} color={preferences.fontStyle === 'professional' ? '#9902d3' : '#6B7280'} />}
            />
            <StyleOption
              title="Casual"
              selected={preferences.fontStyle === 'casual'}
              onPress={() => setPreferences(prev => ({ ...prev, fontStyle: 'casual' }))}
              icon={<Ionicons name="happy" size={24} color={preferences.fontStyle === 'casual' ? '#9902d3' : '#6B7280'} />}
            />
          </PreferenceSection>

          {/* Icon Pack Style */}
          <PreferenceSection title="Icon Pack & Button Style">
            <StyleOption
              title="Filled Icons"
              selected={preferences.iconPack === 'filled'}
              onPress={() => setPreferences(prev => ({ ...prev, iconPack: 'filled' }))}
              icon={<Ionicons name="apps" size={24} color={preferences.iconPack === 'filled' ? '#9902d3' : '#6B7280'} />}
            />
            <StyleOption
              title="Outlined Icons"
              selected={preferences.iconPack === 'outlined'}
              onPress={() => setPreferences(prev => ({ ...prev, iconPack: 'outlined' }))}
              icon={<Ionicons name="apps-outline" size={24} color={preferences.iconPack === 'outlined' ? '#9902d3' : '#6B7280'} />}
            />
          </PreferenceSection>

          {/* Animation Preferences */}
          <PreferenceSection title="Animation Preferences">
            <View className="flex-row items-center justify-between p-3 bg-white/50 rounded-xl backdrop-blur-sm">
              <View>
                <Text className="font-psemibold text-gray-900">Enable Animations</Text>
                <Text className="text-gray-500 text-sm">Smooth transitions and effects</Text>
              </View>
              <Switch
                value={preferences.enableAnimations}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, enableAnimations: value }))}
                trackColor={{ false: '#E5E7EB', true: '#9902d3' }}
                thumbColor={preferences.enableAnimations ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </PreferenceSection>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appearance;