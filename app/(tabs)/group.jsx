import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Modal, Image, TextInput, Animated, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect, useRef,useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import { getChatSession, getUsers, createChatSession, deleteChatSession } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import ChatSession from "@/components/ChatSession";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import {client,appwriteConfig} from "../../lib/appwrite";

const newMessageIcon = require('../../assets/icons/new-message.png');

const Group = () => {
  const { data: chatSession, refetch } = useAppwrite(getChatSession);
  const { user } = useGlobalContext();
  const [showUserList, setShowUserList] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  let swipeableRef = useRef(null);
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;
  const path=`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatSessionId}.documents`;
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
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      // First check if we already have the chat sessions
      await refetch();
      const existingChatSessions = chatSession || [];

      // Check if a chat already exists with this user
      const existingChat = existingChatSessions.find(session =>
        (session.PersonA.$id === user.$id && session.PersonB.$id === selectedUser.$id) ||
        (session.PersonB.$id === user.$id && session.PersonA.$id === selectedUser.$id)
      );

      if (existingChat) {
        // If chat exists, just navigate to it
        setShowUserList(false);
        router.push({
          pathname: "/message",
          params: {
            SessionID: existingChat.$id,
            recipientName: selectedUser.username
          }
        });
        return;
      }

      // If no existing chat, create a new one
      console.log("Creating new chat session...");
      const newChat = await createChatSession(
        user.$id,
        selectedUser.$id,
        user.username,
        selectedUser.username
      );

      setShowUserList(false);
      router.push({
        pathname: "/message",
        params: {
          SessionID: newChat.$id,
          recipientName: selectedUser.username
        }
      });

    } catch (error) {
      console.error("Error starting chat session:", error);
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChat) return;

    try {
      await deleteChatSession(selectedChat.$id);
      refetch(); // Refresh the chat list
      setDeleteModalVisible(false);
      setSelectedChat(null);
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      Alert.alert("Error", "Failed to delete chat. Please try again.");
    }
  };

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        className="bg-red-500 w-20 h-full justify-center items-center"
        onPress={() => {
          setSelectedChat(item);
          setDeleteModalVisible(true);
        }}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const MenuSection = ({ title, children }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 24,
      }}
    >
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#666', 
        marginBottom: 8,
        paddingHorizontal: 20,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        {title}
      </Text>
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
        {children}
      </View>
    </Animated.View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <ScrollView>
          <View style={{ padding: 16, paddingTop: 24 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: 24,
              paddingHorizontal: 20
            }}>
              Messages
            </Text>

            <MenuSection title="Recent Conversations">
              {chatSession?.map((item) => {
                let chatTitle = item.title || "Unknown User";
                chatTitle = chatTitle.replace(/https:\/\/cloud\.appwrite\.io\/v1\/avatars\/initials\?.*?&/, "").trim();
                chatTitle = chatTitle.replace(/project=[^&]*&\s*/, "").trim();

                let recentMessage = item.recentMessage || "";
                recentMessage = recentMessage.replace(/^.*?:\s/, "");

                return (
                  <Swipeable
                    key={item.$id}
                    ref={swipeableRef}
                    renderRightActions={() => renderRightActions(item)}
                  >
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: "/message", params: { SessionID: item.$id, recipientName: chatTitle } })}
                      style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                        backgroundColor: 'white'
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 12,
                        backgroundColor: '#F3F4F6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        overflow: 'hidden'
                      }}>
                        <Image
                          source={{ uri: item.PersonA.$id === user.$id ? item.PersonB.avatar : item.PersonA.avatar }}
                          style={{ width: '100%', height: '100%', borderRadius: 12 }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: 16, 
                          fontWeight: '600',
                          color: '#1F2937'
                        }}>
                          {chatTitle}
                        </Text>
                        <Text style={{ 
                          fontSize: 13, 
                          color: '#6B7280', 
                          marginTop: 2 
                        }} numberOfLines={1}>
                          {recentMessage}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ 
                          fontSize: 12, 
                          color: '#9CA3AF'
                        }}>
                          {new Date(item.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <View style={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: 4, 
                          backgroundColor: '#9902d3',
                          marginTop: 4
                        }} />
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                );
              })}
            </MenuSection>
          </View>
        </ScrollView>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-[80%] max-w-sm">
              <Text className="text-xl font-semibold text-gray-900 mb-4">Delete Conversation</Text>
              <Text className="text-gray-600 mb-6">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </Text>
              <View className="flex-row justify-end space-x-4">
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModalVisible(false);
                    setSelectedChat(null);
                    if (swipeableRef.current) {
                      swipeableRef.current.close();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100"
                >
                  <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteChat}
                  className="px-4 py-2 rounded-xl bg-red-500"
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            backgroundColor: '#9902d3',
            padding: 16,
            borderRadius: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={async () => {
            await fetchUsers();
            setShowUserList(true);
          }}
        >
          <Image 
            source={newMessageIcon} 
            style={{ width: 24, height: 24, tintColor: '#ffffff' }}
          />
        </TouchableOpacity>

        <Modal visible={showUserList} transparent={true} animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ 
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              width: '80%',
              maxHeight: '80%',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: '#1F2937' }}>Select a User</Text>
                <TouchableOpacity onPress={() => setShowUserList(false)}>
                  <Ionicons name="close-circle" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={{ position: 'relative', marginBottom: 16 }}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 12 }} />
                <TextInput
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingLeft: 40,
                    paddingRight: 16,
                    paddingVertical: 12,
                    color: '#1F2937',
                  }}
                  placeholder="Search users..."
                  placeholderTextColor="#9CA3AF"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              <FlatList
                data={users.filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()))}
                keyExtractor={(item) => item.$id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f0f0f0',
                    }}
                    onPress={() => startChat(item)}
                  >
                    <View style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 12,
                      backgroundColor: '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      overflow: 'hidden'
                    }}>
                      <Image
                        source={{ uri: item.avatar }}
                        style={{ width: '100%', height: '100%', borderRadius: 12 }}
                      />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>{item.username}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Group;