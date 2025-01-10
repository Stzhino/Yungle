import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import SearchInput from '../../components/Searchinput'
import icons from '../../constants/icons'
import EmptyState from '../../components/EmptyState'
import { getUsers, searchUsers } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import InfoCard from '../../components/InfoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const { query } = useLocalSearchParams();
  const{data:users, refetch}=useAppwrite(()=>searchUsers(query));

  useEffect(()=>{
    refetch();
  }, [query])
  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={users}
        keyExtractor={(item)=>item.$id}
        renderItem={({item})=>(
          <InfoCard profile={item}/>
        )}
        ListHeaderComponent={()=>(
          <View>
            <View className = "my-6 px-4 space-y-6">
              <Text className="font-pmedium text-sm text-gray-500">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold mb-3">
                {query}
              </Text>
              <SearchInput initialQuery={query}/>
            </View>    
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState
            title = "No Users Found"
          />
        )}
      />
    </SafeAreaView>
    
  )
}

export default Search