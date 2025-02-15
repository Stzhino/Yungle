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
import { useRefetchContext } from '../../context/RefetchProvider';
const searchFunct = (search, notifArr) => {
  if (search !== '') {
    return notifArr.filter(
      (item) =>
        item.name.includes(search) ||
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
  const {notifRefetch,setNotifRefetch} = useRefetchContext();

  useEffect(() => {
    const debounced = debounce((value) => {
      setDebouncedSearch(value);
    }, 500);
    debounced(search);
    return () => {
      debounced.cancel();
    };
  }, [search]);

  useFocusEffect(
      if (notifRefetch) {
        setNotifRefetch(false); 
        refetch();
      }
  );
  
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
          className='w-[90%] mt-10'
        />)}
      </View>
    </SafeAreaView>
  );
}
