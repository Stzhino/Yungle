import { SafeAreaView, View, Text, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import SearchInput from '../../components/Searchinput';
import { getMessages, getMostRecentChats, addOrUpdateMessageToAppwrite } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import MessageCards from '../../components/MessageCards';

const Group = () => {
  const { data: messages, refetch: refetchMessages } = useAppwrite(getMessages);
  const { data: chats, refetch: refetchChats } = useAppwrite(getMostRecentChats);

  useEffect(() => {
    // Fetch messages initially
    refetchMessages();
  }, []);

  const listenForMessages = async () => {
    try {
      if (!chats) return;

      for (const chat of chats) {
        if (!chat.sender) continue;

        const existingMessage = messages?.find((m) => m.sender === chat.sender);

        if (existingMessage) {
          await addOrUpdateMessageToAppwrite({ ...existingMessage, message: chat.message }, existingMessage);
        } else {
          await addOrUpdateMessageToAppwrite({
            userId: chat.userId,
            sender: chat.sender,
            name: chat.name,
            avatarUrl: chat.avatarUrl,
            message: chat.message,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      Alert.alert('Error', 'Failed to fetch messages.');
    }
  };

  useEffect(() => {
    listenForMessages();
  }, [chats]);

  return (
    <SafeAreaView>
      <SearchInput placeholder="Search messages..." />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageCards message={item} />}
      />
    </SafeAreaView>
  );
};

export default Group;
