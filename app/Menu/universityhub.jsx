import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Animated, Dimensions } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '../../constants/icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start(),
    ]).start();
  }, []);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="active:opacity-70"
    >
      <Animated.View 
        style={{ 
          transform: [{ scale: scaleAnim }],
          shadowColor: '#9902d3',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.3],
          }),
          shadowRadius: 10,
          elevation: 5,
        }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-4 border border-white/20"
      >
        <LinearGradient
          colors={['rgba(153, 2, 211, 0.1)', 'rgba(153, 2, 211, 0.05)']}
          className="absolute inset-0 rounded-2xl"
        />
        <View className="flex-row items-center">
          <View className="bg-primary/10 p-4 rounded-2xl backdrop-blur-sm mr-4">
            <Image 
              source={icon} 
              className="w-8 h-8" 
              resizeMode='contain'
              style={{ tintColor: '#9902d3' }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-psemibold text-gray-900">{title}</Text>
            <Text className="text-base text-gray-500 mt-2">{description}</Text>
          </View>
          <Image 
            source={icons.chevron} 
            className="w-6 h-6 ml-4" 
            resizeMode='contain'
            style={{ tintColor: '#666' }}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const EventCard = ({ title, date, location, participants }) => {
  return (
    <View className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
      <LinearGradient
        colors={['rgba(153, 2, 211, 0.1)', 'rgba(153, 2, 211, 0.05)']}
        className="absolute inset-0 rounded-2xl"
      />
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-psemibold text-gray-900">{title}</Text>
          <View className="flex-row items-center mt-2 space-x-4">
            <View className="flex-row items-center bg-white/50 px-2 py-1 rounded-full">
              <Image 
                source={icons.calendar} 
                className="w-4 h-4 mr-1" 
                resizeMode='contain'
                style={{ tintColor: '#9902d3' }}
              />
              <Text className="text-sm text-gray-600">{date}</Text>
            </View>
            <View className="flex-row items-center bg-white/50 px-2 py-1 rounded-full">
              <Image 
                source={icons.location} 
                className="w-4 h-4 mr-1" 
                resizeMode='contain'
                style={{ tintColor: '#9902d3' }}
              />
              <Text className="text-sm text-gray-600">{location}</Text>
            </View>
          </View>
        </View>
        <View className="bg-primary/20 px-3 py-1 rounded-full backdrop-blur-sm">
          <Text className="text-sm font-psemibold text-primary">{participants} participants</Text>
        </View>
      </View>
    </View>
  );
};

const ResourceCard = ({ title, icon, description, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="active:opacity-70"
    >
      <View className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-3 border border-white/20">
        <LinearGradient
          colors={['rgba(153, 2, 211, 0.1)', 'rgba(153, 2, 211, 0.05)']}
          className="absolute inset-0 rounded-2xl"
        />
        <View className="flex-row items-center">
          <View className="bg-primary/10 p-3 rounded-xl backdrop-blur-sm mr-3">
            <Image 
              source={icon} 
              className="w-6 h-6" 
              resizeMode='contain'
              style={{ tintColor: '#9902d3' }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-psemibold text-gray-900">{title}</Text>
            <Text className="text-sm text-gray-500">{description}</Text>
          </View>
          <Image 
            source={icons.chevron} 
            className="w-5 h-5" 
            resizeMode='contain'
            style={{ tintColor: '#666' }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DiscountCard = ({ title, description, discount, validUntil, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="active:opacity-70"
    >
      <View className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-3 border border-white/20">
        <LinearGradient
          colors={['rgba(153, 2, 211, 0.1)', 'rgba(153, 2, 211, 0.05)']}
          className="absolute inset-0 rounded-2xl"
        />
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-psemibold text-gray-900">{title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{description}</Text>
            <Text className="text-xs text-gray-400 mt-1">Valid until {validUntil}</Text>
          </View>
          <View className="bg-primary/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <Text className="text-sm font-psemibold text-primary">{discount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const universityhub = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  const events = [
    {
      id: '1',
      title: 'Career Fair 2024',
      date: 'Mar 15, 2024',
      location: 'Student Center',
      participants: 150
    },
    {
      id: '2',
      title: 'Tech Workshop',
      date: 'Mar 20, 2024',
      location: 'Engineering Building',
      participants: 45
    },
    {
      id: '3',
      title: 'Campus Tour',
      date: 'Mar 25, 2024',
      location: 'Main Campus',
      participants: 30
    }
  ];

  const resources = [
    {
      id: '1',
      title: 'Library Services',
      icon: require('../../assets/icons/library-shelves.png'),
      description: 'Access digital resources and study spaces',
      onPress: () => {}
    },
    {
      id: '2',
      title: 'Career Center',
      icon: require('../../assets/icons/toolbox-outline.png'),
      description: 'Get help with internships and job search',
      onPress: () => {}
    },
    {
      id: '3',
      title: 'Health Services',
      icon: icons.heart,
      description: 'Access medical and mental health support',
      onPress: () => {}
    }
  ];

  const discounts = [
    {
      id: '1',
      title: 'Campus Bookstore',
      description: '20% off on all textbooks',
      discount: '20% OFF',
      validUntil: 'Dec 31, 2024',
      onPress: () => {}
    },
    {
      id: '2',
      title: 'Local Coffee Shop',
      description: 'Free coffee with student ID',
      discount: 'FREE',
      validUntil: 'Ongoing',
      onPress: () => {}
    },
    {
      id: '3',
      title: 'Gym Membership',
      description: '50% off annual membership',
      discount: '50% OFF',
      validUntil: 'Jun 30, 2024',
      onPress: () => {}
    }
  ];

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
              onPress={() => router.back()}
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
              <Text className="text-3xl font-psemibold text-gray-900">University Hub</Text>
              <Text className="text-base text-gray-500 mt-1">Connect with your university community</Text>
            </Animated.View>
          </View>

          {/* Main Features */}
          <View className="mb-6">
            <Text className="text-lg font-psemibold text-gray-900 mb-4">Quick Actions</Text>
            <FeatureCard
              icon={icons.profile}
              title="University Profiles"
              description="Connect with students from your school"
              onPress={() => {}}
            />
            <FeatureCard
              icon={icons.search}
              title="Find Classmates"
              description="Match with students in your major and courses"
              onPress={() => {}}
            />
            <FeatureCard
              icon={require('../../assets/icons/group.png')}
              title="University Group Chat"
              description="Join the conversation with your peers"
              onPress={() => {}}
            />
            <FeatureCard
              icon={require('../../assets/icons/mountain.png')}
              title="Campus Map"
              description="Navigate campus buildings and facilities"
              onPress={() => {}}
            />
          </View>

          {/* Campus Resources */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-psemibold text-gray-900">Campus Resources</Text>
              <TouchableOpacity className="bg-primary/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Text className="text-sm font-psemibold text-primary">View All</Text>
              </TouchableOpacity>
            </View>
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                icon={resource.icon}
                description={resource.description}
                onPress={resource.onPress}
              />
            ))}
          </View>

          {/* Events Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-psemibold text-gray-900">Upcoming Events</Text>
              <TouchableOpacity className="bg-primary/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Text className="text-sm font-psemibold text-primary">View All</Text>
              </TouchableOpacity>
            </View>
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                participants={event.participants}
              />
            ))}
          </View>

          {/* Student Discounts */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-psemibold text-gray-900">Student Discounts</Text>
              <TouchableOpacity className="bg-primary/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Text className="text-sm font-psemibold text-primary">View All</Text>
              </TouchableOpacity>
            </View>
            {discounts.map((discount) => (
              <DiscountCard
                key={discount.id}
                title={discount.title}
                description={discount.description}
                discount={discount.discount}
                validUntil={discount.validUntil}
                onPress={discount.onPress}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default universityhub