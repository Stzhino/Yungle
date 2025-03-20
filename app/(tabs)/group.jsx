import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from "@/context/GlobalProvider";
import { getChatSession, getUsers, createChatSession } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import ChatSession from "@/components/ChatSession";
import { useRouter } from "expo-router";

const newMessageIcon = require('../../assets/icons/new-message.png');

const Group = () => {
  const { data: chatSession, refetch } = useAppwrite(getChatSession);
  const { user } = useGlobalContext();
  const [showUserList, setShowUserList] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const allUsers = await getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const startChat = async (selectedUser) => {
    try {
      let chatExists = chatSession.find(session =>
        (session.PersonA === user.$id && session.PersonB === selectedUser.$id) ||
        (session.PersonB === user.$id && session.PersonA === selectedUser.$id)
      );

      if (!chatExists) {
        chatExists = await createChatSession(
          user.$id,
          selectedUser.$id,
          user.username,
          selectedUser.username
        );
        refetch();
      } else {
        console.log("Chat session already exists:", chatExists);
      }

      setShowUserList(false);

      console.log("Navigating to message screen with:", {
        SessionID: chatExists.$id,
        recipientName: selectedUser.username
      });

      router.push({
        pathname: "/message",
        params: {
          SessionID: chatExists.$id,
          recipientName: selectedUser.username
        }
      });

    } catch (error) {
      console.error("Error starting new chat session:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pt-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Messages</Text>
      </View>

      <FlatList
        data={chatSession}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          let chatTitle = item.title || "Unknown User";
          chatTitle = chatTitle.replace(/https:\/\/cloud\.appwrite\.io\/v1\/avatars\/initials\?.*?&/, "").trim();
          chatTitle = chatTitle.replace(/project=[^&]*&\s*/, "").trim();

          let recentMessage = item.recentMessage || "";
          recentMessage = recentMessage.replace(/^.*?:\s/, "");

          return (
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 bg-white rounded-lg shadow-sm"
              onPress={() => router.push({ pathname: "/message", params: { SessionID: item.$id, recipientName: chatTitle } })}
            >
              <Image
                source={{ uri: item.PersonA.$id === user.$id ? item.PersonB.avatar : item.PersonA.avatar }}
                className="w-12 h-12 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold">{chatTitle}</Text>
                <Text className="text-gray-500 text-sm truncate">{recentMessage}</Text>
              </View>
              <Text className="text-gray-400 text-xs">{new Date(item.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-purple-600 p-4 rounded-full shadow-lg"
        onPress={() => {
          fetchUsers();
          setShowUserList(true);
        }}
      >
        <Image source={newMessageIcon} className="w-6 h-6 tint-white" />
      </TouchableOpacity>

      <Modal visible={showUserList} transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-xl w-4/5 shadow-lg">
            <Text className="text-lg font-bold text-center text-gray-900 mb-4">Select a User</Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Search users..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={users.filter(user => user.username.includes(searchText))}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-gray-200"
                  onPress={() => startChat(item)}
                >
                  <Text className="text-base text-gray-800">{item.username}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity className="mt-4 bg-red-500 p-3 rounded-lg" onPress={() => setShowUserList(false)}>
              <Text className="text-white text-center text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Group;
