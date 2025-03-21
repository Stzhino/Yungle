import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert, Animated, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from "@/context/GlobalProvider";
import { useNavigation } from "@react-navigation/native";
import FriendCards from '../../components/FriendCards';
import { fetchFriends } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import EmptyState from '../../components/EmptyState'


const FriendList = () => {
    const navigation = useNavigation();
    const { data: users, isLoading: isLoadingUsers, refetch: refetch } = useAppwrite(fetchFriends);
    useEffect(() => {
        console.log("Users data:", users);
    }, [users]);

    const [refreshing, setRefreshing] = useState(false);
      const onRefresh = async () => {
        setRefreshing(true);
        try {
          await refetch();
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
            data={users}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <FriendCards profile={item} />}
            ListHeaderComponent={() => (
                <View className = "flex flex-row items-center mb-4">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="ml-4"
                    >
                        <Image 
                        source={require('../../assets/icons/leftArrow.png')}
                        className="w-6 h-6" 
                        resizeMode='contain'
                        style={{ tintColor: '#9902d3' }}
                        />
                    </TouchableOpacity>
                    <Text className="mt-1 ml-4 text-center font-psemibold text-2xl">Friend List</Text>
                </View>
            )}
            ListEmptyComponent={() => (
                <EmptyState
                title="No Friends"
                subtitle="Add some friends!"
                />
            )}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#9902d3"
                    colors={['#9902d3']}
                />
            }
        />
        
    </SafeAreaView>
  )
}

export default FriendList