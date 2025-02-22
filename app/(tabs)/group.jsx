import { SafeAreaView, View, Text, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DATABASES_ID,MESSAGE_ID } from '../../lib/appwrite';
import { mess_databases } from '../../lib/appwrite';
import { ID, Query } from 'react-native-appwrite';
import { TextInput , Button} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { useRef } from 'react';
import { client } from '../../lib/appwrite';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Group = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] =useState('');
  const flatListRef = useRef();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(`databases.${DATABASES_ID}.collections.${MESSAGE_ID}.documents`, response => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        console.log("A message was created");

        setMessages(prevState => {
          const exists = prevState.some(msg => msg.$id === response.payload.$id);
          return exists ? prevState : [...prevState, response.payload];
        });

        scrollToBottom();
      }

      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        console.log("A message was deleted");
        setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async () => {
    if (!messageBody.trim()) return;

    try {
      await mess_databases.createDocument(
        DATABASES_ID,
        MESSAGE_ID,
        ID.unique(),
        { body: messageBody }
      );

      setMessageBody('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getMessages = async () => {
    try {
      const response = await mess_databases.listDocuments(DATABASES_ID, MESSAGE_ID, [Query.limit(20)]);

      setMessages(prevState => {
        const newMessages = response.documents.filter(doc => !prevState.some(msg => msg.$id === doc.$id));
        return [...prevState, ...newMessages];
      });

      scrollToBottom();
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch messages');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1' keyboardVerticalOffset={80}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.$id}
          renderItem={({ item }) => (
            <View className='m-2 p-3 bg-purple-200 rounded-lg max-w-[80%] self-start'>
              <Text className='text-gray-700 text-xs'>{new Date(item.$createdAt).toLocaleTimeString()}</Text>
              <Text className='text-gray-900 mt-1'>{item.body}</Text>
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          onContentSizeChange={scrollToBottom}
        />
        <View className='flex-row items-center bg-purple-100 p-4 border-t border-purple-300'>
          <TextInput
            className='flex-1 bg-white text-gray-900 p-3 rounded-lg border border-purple-300'
            placeholder='Type a message...'
            placeholderTextColor='#777'
            value={messageBody}
            onChangeText={setMessageBody}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === 'Enter') {
                if (e.shiftKey) {
                  setMessageBody(prev => prev + "\n");
                } else {
                  e.preventDefault();
                  handleSubmit();
                }
              }
            }}
            multiline
          />
          <TouchableOpacity onPress={handleSubmit} className='ml-3 bg-purple-500 p-3 rounded-full'>
            <Ionicons name='send' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Group;
