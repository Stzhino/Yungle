import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import SearchInput from '../../components/Searchinput'
import icons from '../../constants/icons'
import EmptyState from '../../components/EmptyState'
import { getUsers, getInterest, getRecommendationsAll, getRecommendations } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import ProfileCards from '../../components/ProfileCards'

const Suggestion = () => {
  const [forYou, setForYou] = useState(true);
  const [DEI, setDEI] = useState(false);
  const [hiking, setHiking] = useState(false);
  const [realEstate, setRealEstate] = useState(false);
  const [fashion, setFashion] = useState(false);

  // unfiltered
  // const { data: users, isLoading: isLoadingUsers, refetch: refetch } = useAppwrite(() => getRecommendationsALL());
  // const { data: DEIUsers, isLoading: isLoadingDEI, refetch: refetchDEI } = useAppwrite(() => getRecommendations("DEI"))
  // const { data: HikingUsers, isLoading: isLoadingHiking, refetch: refetchHiking } = useAppwrite(() => getRecommendations("Hiking"))
  // const { data: REUsers, isLoading: isLoadingRE, refetch: refetchRE } = useAppwrite(() => getRecommendations("Real Estate"))
  // const { data: FashionUsers, isLoading: isLoadingFashion, refetch: refetchFashion } = useAppwrite(() => getRecommendations("Fashion"))
  const { data: users, isLoading: isLoadingUsers, refetch: refetch } = useAppwrite(getUsers);
  const { data: DEIUsers, isLoading: isLoadingDEI, refetch: refetchDEI } = useAppwrite(() => getRecommendations("DEI"))
  const { data: HikingUsers, isLoading: isLoadingHiking, refetch: refetchHiking } = useAppwrite(() => getRecommendations("Hiking"))
  const { data: REUsers, isLoading: isLoadingRE, refetch: refetchRE } = useAppwrite(() => getRecommendations("Real Estate"))
  const { data: FashionUsers, isLoading: isLoadingFashion, refetch: refetchFashion } = useAppwrite(() => getRecommendations("Fashion"))
  const { data: reccs, isLoading: isLoadingReccs, refetch: refetchReccs } = useAppwrite(() => getRecommendationsAll())

  const [info, setInfo] = useState([]);
  useEffect(() => {
    if (forYou) {
      setInfo(reccs);
    }
    else if (DEI) {
      setInfo(DEIUsers);
    }
    else if (hiking) {
      setInfo(HikingUsers);
    }
    else if (fashion) {
      setInfo(FashionUsers);
    }
    else if (realEstate) {
      setInfo(REUsers);
    }
  }, [forYou, DEI, hiking, fashion, realEstate, reccs, DEIUsers, HikingUsers, FashionUsers, REUsers])

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchDEI();
    await refetchFashion();
    await refetchRE();
    await refetchHiking();
    await refetchReccs();

    console.log(users);
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={info}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <ProfileCards profile={item} />
        )}
        ListHeaderComponent={() => (
          <View>
            <View className="my-6 px-4 space-y-6">
              <SearchInput />
            </View>
            <View className="flex flex-row w-full justify-between px-3">
              <TouchableOpacity onPress={() => {
                setForYou(true);
                setDEI(false);
                setHiking(false);
                setRealEstate(false);
                setFashion(false);
                setInfo(users);
              }}>
                <View className={`${forYou ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.foryou} className="w-6 h-6 mb-2" resizeMode='contain' />
                  <Text className="text-sm">For You</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setForYou(false);
                setDEI(true);
                setHiking(false);
                setRealEstate(false);
                setFashion(false);
                setInfo(DEIUsers);
              }}>
                <View className={`${DEI ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.dei} className="w-6 h-6 mb-2" resizeMode='contain' />
                  <Text className="text-sm">DEI</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setForYou(false);
                setDEI(false);
                setHiking(true);
                setRealEstate(false);
                setFashion(false);
                setInfo(HikingUsers);
              }}>
                <View className={`${hiking ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.hiking} className="w-6 h-6 mb-2" resizeMode='contain' />
                  <Text className="text-sm">Hiking</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setForYou(false);
                setDEI(false);
                setHiking(false);
                setRealEstate(true);
                setFashion(false);
                setInfo(REUsers);
              }}>
                <View className={`${realEstate ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.realestate} className="w-6 h-6 mb-2" resizeMode='contain' />
                  <Text className="text-sm">Real Estate</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setForYou(false);
                setDEI(false);
                setHiking(false);
                setRealEstate(false);
                setFashion(true);
                setInfo(FashionUsers);
              }}>
                <View className={`${fashion ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.fashion} className="w-6 h-6 mb-2" resizeMode='contain' />
                  <Text className="text-sm">Fashion</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="my-6 px-4 space-y-6 mt-7 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold">
                  Top Picks for You
                </Text>
                <Text className="font-pregular text-base mt-1">
                  {info.length} Results
                </Text>
              </View>
              <View className="flex-row gap-5">
                <Image
                  source={icons.list}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Image
                  source={icons.rect}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Users Found"
          />
        )}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
      />
    </SafeAreaView>

  )
}

export default Suggestion