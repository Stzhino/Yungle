import { SafeAreaView, View, Text, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DATABASES_ID,MESSAGE_ID } from '../../lib/appwrite';
import { mess_databases } from '../../lib/appwrite';
import { ScrollView } from 'react-native';
import { ID, Query } from 'react-native-appwrite';
import { TextInput , Button} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { useRef } from 'react';
import { client } from '../../lib/appwrite';

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
    <SafeAreaView className='flex-1 max-w-[600px] mx-auto mt-5'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 relative'
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.$id || index.toString()}
          renderItem={({ item }) => (
            <View className='flex flex-col gap-2 m-4'>
              <View className='flex justify-between items-center'>
                <Text className='text-gray-500 ml-4'>{item.$createdAt}</Text>
              </View>
              <View>
                <Text className='p-4 bg-[rgba(219,26,90,1)] text-[#e2e3e8] rounded-2xl w-fit max-w-full break-words'>
                  {item.body}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          onContentSizeChange={scrollToBottom}
        />

        <View className='mb-8 bg-[rgba(27,27,39,1)] p-4 border-t border-[rgba(40,41,57,1)]'>
          <TextInput
            className='border border-gray-300 p-2 rounded mb-2 text-white'
            placeholder='Say Something'
            placeholderTextColor='#ccc'
            maxLength={1000}
            multiline
            value={messageBody}
            onChangeText={setMessageBody}
          />
          <Button title='Submit' onPress={handleSubmit} color='#8db3dd' />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Group;
