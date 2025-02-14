import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import SearchInput from '../../components/Searchinput'
import icons from '../../constants/icons'
import EmptyState from '../../components/EmptyState'
import { getUsers } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import ProfileCards from '../../components/ProfileCards'

const TabIcon = ({icons, color}) =>{
  return (
    <View clasName='w-6 h-6 mb-2'>

    </View>
  
  )
}

const Suggestion = () => {
  const [forYou, setForYou] = useState(true);
  const [DEI, setDEI] = useState(false);
  const [hiking, setHiking] = useState(false);
  const [realEstate, setRealEstate] = useState(false);
  const [fashion, setFashion] = useState(false);

  const{data:users, refetch}=useAppwrite(getUsers);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    console.log(users);
    setRefreshing(false);
  }
  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={users}
        keyExtractor={(item)=>item.$id}
        renderItem={({item})=>(
          <ProfileCards profile={item}/>
        )}
        ListHeaderComponent={()=>(
          <View>
            <View className = "my-6 px-4 space-y-6">
              <SearchInput />
            </View>
            <View className = "flex flex-row w-full justify-between px-3">
            {// From here  
            }
              <TouchableOpacity onPress={() => {
                  setForYou(true);
                  setDEI(false);
                  setHiking(false);
                  setRealEstate(false);
                  setFashion(false)
              }}>
                <View className = {`${forYou ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.foryou} className="w-6 h-6 mb-2" resizeMode='contain'/>
                  <Text className="text-sm">For You</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                  setForYou(false);
                  setDEI(true);
                  setHiking(false);
                  setRealEstate(false);
                  setFashion(false)
              }}>
                <View className = {`${DEI ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.dei} className="w-6 h-6 mb-2" resizeMode='contain'/>
                  <Text className="text-sm">DEI</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                  setForYou(false);
                  setDEI(false);
                  setHiking(true);
                  setRealEstate(false);
                  setFashion(false)
              }}>
                <View className = {`${hiking ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.hiking} className="w-6 h-6 mb-2" resizeMode='contain'/>
                  <Text className="text-sm">Hiking</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                  setForYou(false);
                  setDEI(false);
                  setHiking(false);
                  setRealEstate(true);
                  setFashion(false)
              }}>
                <View className = {`${realEstate ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.realestate} className="w-6 h-6 mb-2" resizeMode='contain'/>
                  <Text className="text-sm">Real Estate</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                  setForYou(false);
                  setDEI(false);
                  setHiking(false);
                  setRealEstate(false);
                  setFashion(true)
              }}>
                <View className = {`${fashion ? "bg-purple-200" : ""} p-2 rounded-xl items-center justify-center`}>
                  <Image source={icons.fashion} className="w-6 h-6 mb-2" resizeMode='contain'/>
                  <Text className="text-sm">Fashion</Text>
                </View>
              </TouchableOpacity>
            </View>
            {
              // End here
            }
            <View className="my-6 px-4 space-y-6 mt-7 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold">
                  Top Picks for You
                </Text>
                <Text className="font-pregular text-base mt-1">
                  {users.length} Results
                </Text>
              </View>
              <View className="flex-row gap-5">
                <Image 
                  source = {icons.list}
                  className = "w-6 h-6"
                  resizeMode = "contain"
                />
                <Image 
                  source = {icons.rect}
                  className = "w-6 h-6"
                  resizeMode = "contain"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState
            title = "No Users Found"
          />
        )}
        refreshControl = {<RefreshControl
          refreshing = {refreshing}
          onRefresh = {onRefresh}
        />}
      />
    </SafeAreaView>
    
  )
}

export default Suggestion