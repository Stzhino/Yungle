import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import SearchBar from '@/components/SearchBar';
import NotificationBox from '@/components/NotificationBox';
import { debounce } from 'lodash';
import EmptyState from '../../components/EmptyState'


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
  const [search, setSearch] = useState('');
  const [notifArr, setNotifArr] = useState([ //Note this default value will be deleted once backend is implemented
    {
      name: 'hang',
      type: 'message',
      title: 'New Message',
      description: `hang commented: "My name is Hang"`,
      time: '1 hour ago',
      profileUri: 'https://www.w3schools.com/w3images/avatar2.png',
    },
    {
      name: 'jacky',
      type: 'like',
      title: 'New Like',
      description: `jacky just liked your post`,
      time: '1 day ago',
      profileUri: 'https://www.w3schools.com/w3images/avatar2.png',
    },
    {
      name: 'Jim',
      type: 'follow',
      title: 'New Follower',
      description: `Jim started following you`,
      time: '2 day ago',
      profileUri: 'https://www.w3schools.com/w3images/avatar2.png',
    },
  ]);
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

  useEffect(() => {
    // Set the StatusBar appearance
    StatusBar.setBarStyle('dark-content'); // For dark text on the status bar
  }, []);

  const filteredNotifications = searchFunct(debouncedSearch, notifArr);

  return (
    <SafeAreaView className="flex-1 items-center">
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
    </SafeAreaView>
  );
}
