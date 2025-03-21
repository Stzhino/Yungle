import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert, Animated, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import SearchInput from '../../components/Searchinput'
import icons from '../../constants/icons'
import EmptyState from '../../components/EmptyState'
import { getUsers, getInterest, getRecommendationsAll, getRecommendations } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import ProfileCards from '../../components/ProfileCards'

const CategoryButton = ({ icon, label, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="relative"
    >
      <Animated.View 
        style={{ transform: [{ scale: scaleAnim }] }}
        className={`p-3 rounded-2xl items-center justify-center ${isActive ? "bg-primary/20" : "bg-gray-50"}`}
      >
        <View className={`rounded-full p-2 ${isActive ? "bg-primary/20" : "bg-gray-100"}`}>
          <Image 
            source={icon} 
            className="w-6 h-6" 
            resizeMode='contain'
            style={{ tintColor: isActive ? '#9902d3' : '#666' }}
          />
        </View>
        <Text className={`text-sm mt-2 font-psemibold ${isActive ? "text-primary" : "text-gray-600"}`}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const Suggestion = () => {
  const [forYou, setForYou] = useState(true);
  const [DEI, setDEI] = useState(false);
  const [hiking, setHiking] = useState(false);
  const [realEstate, setRealEstate] = useState(false);
  const [fashion, setFashion] = useState(false);

  const { data: users, isLoading: isLoadingUsers, refetch: refetch } = useAppwrite(getUsers);
  const { data: DEIUsers, isLoading: isLoadingDEI, refetch: refetchDEI } = useAppwrite(() => getRecommendations("DEI"))
  const { data: HikingUsers, isLoading: isLoadingHiking, refetch: refetchHiking } = useAppwrite(() => getRecommendations("Hiking"))
  const { data: REUsers, isLoading: isLoadingRE, refetch: refetchRE } = useAppwrite(() => getRecommendations("Real Estate"))
  const { data: FashionUsers, isLoading: isLoadingFashion, refetch: refetchFashion } = useAppwrite(() => getRecommendations("Fashion"))
  const { data: reccs, isLoading: isLoadingReccs, refetch: refetchReccs } = useAppwrite(() => getRecommendationsAll())

  useEffect(() => {
  }, [users, DEIUsers, HikingUsers, REUsers, FashionUsers, reccs]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  const [info, setInfo] = useState([]);
  useEffect(() => {
    if (forYou) {
      console.log("Setting For You users:", users);
      setInfo(users || []);
    }
    else if (DEI) {
      console.log("Setting DEI users:", DEIUsers);
      setInfo(DEIUsers || []);
    }
    else if (hiking) {
      console.log("Setting Hiking users:", HikingUsers);
      setInfo(HikingUsers || []);
    }
    else if (fashion) {
      console.log("Setting Fashion users:", FashionUsers);
      setInfo(FashionUsers || []);
    }
    else if (realEstate) {
      console.log("Setting Real Estate users:", REUsers);
      setInfo(REUsers || []);
    }
  }, [forYou, DEI, hiking, fashion, realEstate, users, DEIUsers, HikingUsers, FashionUsers, REUsers])

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      await refetchDEI();
      await refetchFashion();
      await refetchRE();
      await refetchHiking();
      await refetchReccs();
    } catch (error) {
      console.error('Error refreshing:', error);
    }
    setRefreshing(false);
  }

  if (isLoadingUsers) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9902d3" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={info}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <ProfileCards profile={item} />
          </Animated.View>
        )}
        ListHeaderComponent={() => (
          <View className="mb-4">
            <View className="my-4 px-4">
              <SearchInput />
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              className="px-4"
              contentContainerStyle={{ gap: 12 }}
            >
              <CategoryButton
                icon={icons.foryou}
                label="For You"
                isActive={forYou}
                onPress={() => {
                  setForYou(true);
                  setDEI(false);
                  setHiking(false);
                  setRealEstate(false);
                  setFashion(false);
                  setInfo(users || []);
                }}
              />
              <CategoryButton
                icon={icons.dei}
                label="DEI"
                isActive={DEI}
                onPress={() => {
                  setForYou(false);
                  setDEI(true);
                  setHiking(false);
                  setRealEstate(false);
                  setFashion(false);
                  setInfo(DEIUsers || []);
                }}
              />
              <CategoryButton
                icon={icons.hiking}
                label="Hiking"
                isActive={hiking}
                onPress={() => {
                  setForYou(false);
                  setDEI(false);
                  setHiking(true);
                  setRealEstate(false);
                  setFashion(false);
                  setInfo(HikingUsers || []);
                }}
              />
              <CategoryButton
                icon={icons.realestate}
                label="Real Estate"
                isActive={realEstate}
                onPress={() => {
                  setForYou(false);
                  setDEI(false);
                  setHiking(false);
                  setRealEstate(true);
                  setFashion(false);
                  setInfo(REUsers || []);
                }}
              />
              <CategoryButton
                icon={icons.fashion}
                label="Fashion"
                isActive={fashion}
                onPress={() => {
                  setForYou(false);
                  setDEI(false);
                  setHiking(false);
                  setRealEstate(false);
                  setFashion(true);
                  setInfo(FashionUsers || []);
                }}
              />
            </ScrollView>

            <View className="mt-8 px-4 flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-psemibold text-gray-900">
                  Top Picks for You
                </Text>
                <Text className="font-pregular text-base mt-1 text-gray-500">
                  {info.length} Results
                </Text>
              </View>
              <View className="flex-row gap-4">
                <TouchableOpacity 
                  className="bg-gray-100 p-2 rounded-lg active:opacity-70"
                >
                  <Image
                    source={icons.list}
                    className="w-5 h-5"
                    resizeMode="contain"
                    style={{ tintColor: '#666' }}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-gray-100 p-2 rounded-lg active:opacity-70"
                >
                  <Image
                    source={icons.rect}
                    className="w-5 h-5"
                    resizeMode="contain"
                    style={{ tintColor: '#666' }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
            className="flex-1 justify-center items-center py-8"
          >
            <EmptyState
              title="No Users Found"
              subtitle="Try refreshing or selecting a different category"
            />
          </Animated.View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9902d3"
            colors={['#9902d3']}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default Suggestion