import React, { useState, useEffect,useCallback} from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import SearchBar from '@/components/SearchBar';
import NotificationBox from '@/components/NotificationBox';
import { debounce } from 'lodash';
import EmptyState from '../../components/EmptyState'
import {useGlobalContext} from '../../context/GlobalProvider'
import useAppwrite from '../../lib/useAppwrite'
import { getNotification } from '../../lib/appwrite';
import { createNotification } from '../../lib/appwrite';
import {client,appwriteConfig} from "../../lib/appwrite";
const searchFunct = (search, notifArr) => {
  if (search !== '') {
    return notifArr.filter(
      (item) =>
        item.sender.username.includes(search) ||
        item.description.includes(search) ||
        item.title.includes(search)
    );
  } else {
    return notifArr;
  }
};

export default function Notification() {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const {data:notification,refetch} =useAppwrite(()=>getNotification());
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const debounced = debounce((value) => {
      setDebouncedSearch(value);
    }, 500);
    debounced(search);
    return () => {
      debounced.cancel();
    };
  }, [search]);

  useFocusEffect(useCallback(()=>
  {
      refetch()
  },[]));
  const path=`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.notificationId}.documents`;
    useEffect(()=>{
      const subscribeSession= client.subscribe(path,(response)=>{
       const eventType=response.events[0];
       console.log("realtime work");
        if(eventType.includes("create")) {
          // Log when a new file is uploaded
          console.log("create");
          refetch();
        }
        if(eventType.includes("update"))
        {
          console.log("update");
          refetch();
        }
      })
      return subscribeSession
    },[])
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const filteredNotifications = searchFunct(debouncedSearch, notification);

  return (
    <SafeAreaView className="flex-1 items-center h-full">
      <View className="my-6 px-4 space-y-6">
        <SearchBar
          placeholder="Search notifications"
          eventHandler={(e) => setSearch(e)}
        />
        {filteredNotifications.length == 0 ? (
          <EmptyState
          title = "No Notification Found"
        />
        ) : (<FlatList
          data={filteredNotifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <NotificationBox Notification={item} />}
          className='w-full mt-10'
        />)}
      </View>
    </SafeAreaView>
  );
}
