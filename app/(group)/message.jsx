import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";
import { getMessages, createMessage } from "../../lib/appwrite";
import icons from "../../constants/icons"
import { View, Text, ActivityIndicator, FlatList, TextInput,Keyboard, TouchableOpacity, Image, Animated, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView } from "react-native";
import MessageBubble from "../../components/MessageBubble";

const MessageScreen = () => {
  const navigation = useNavigation();
  const { SessionID, recipientName } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { data: messages, refetch, isFetching } = useAppwrite(() => getMessages(SessionID));
  const { user } = useGlobalContext();
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const flatListRef = useRef(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (!SessionID) {
      console.error("SessionID is missing");
      return;
    }

    if (recipientName) {
      navigation.setOptions({ title: recipientName });
    }

    refetch();
  }, [SessionID]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setChatMessages(messages);
      setIsLoading(false);
      const keyboardShowListener=Keyboard.addListener(
        'keyboardDidShow',
      () => {
        scrollToBottom();
        })
      scrollToBottom();
    } else if (!isFetching) {
      setIsLoading(false);
    }

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [messages, isFetching]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    if (!user || !user.$id) return;

    const messageText = userMessage.trim();
    setUserMessage(""); // Clear input immediately

    // Create an optimistic message
    const optimisticMessage = {
      $id: Date.now().toString(), // Temporary ID
      Message: messageText,
      sender: {
        $id: user.$id,
        avatar: user.avatar,
        username: user.username
      },
      time: new Date().toISOString(),
      sessionID: SessionID,
      read: false
    };

    // Update UI immediately
    setChatMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    scrollToBottom();

    try {
      // Send to server
      const newMessage = await createMessage(SessionID, messageText);
      
      // Replace optimistic message with server response
      setChatMessages((prevMessages) => 
        prevMessages.map(msg => 
          msg.$id === optimisticMessage.$id ? newMessage : msg
        )
      );
      
      // Refetch in background to ensure consistency
      refetch();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message if failed
      setChatMessages((prevMessages) => 
        prevMessages.filter(msg => msg.$id !== optimisticMessage.$id)
      );
      // Show error state (you could add a visual indicator here)
    }
  };

  const handleKeyPress = (e) => {
    if (Platform.OS === 'web') {
      // For web: handle Enter and Shift+Enter
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault(); // Prevent default to avoid new line
          sendMessage();
        }
        // If Shift is pressed, let the default new line behavior happen
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  return (
    <KeyboardAvoidingView 
    className="flex-1"
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS == 'ios' ? 40 : 0}
    >
    <View className="flex-1 bg-white">
      {/* Header */}
      <Animated.View 
        style={{
          paddingTop: Constants.statusBarHeight + 8,
          transform: [{ scale: headerScale }],
          opacity: fadeAnim
        }}
        className="bg-white border-b border-gray-200"
      >
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Image 
              source={require('../../assets/icons/leftArrow.png')}
              className="w-6 h-6" 
              resizeMode='contain'
              style={{ tintColor: '#9902d3' }}
            />
          </TouchableOpacity>
          {recipientName && (
            <Text className="text-lg font-semibold text-gray-900">{recipientName}</Text>
          )}
        </View>
      </Animated.View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#9902d3" />
        </View>
      ) : chatMessages.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 text-lg text-center">No messages yet. Start the conversation!</Text>
        </View>
      ) : (
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="flex-1 px-4 py-2"
        >
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item, index) => item?.$id ?? index.toString()}
            renderItem={({ item }) => {
              if (!item?.Message) return null;
              const isCurrentUser = item.sender?.$id === user?.$id;
              return (
                <MessageBubble 
                  message={item} 
                  isCurrentUser={isCurrentUser}
                />
              );
            }}
            contentContainerStyle={{ paddingBottom: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        </Animated.View>
      )}

      {/* Message Input */}
      <View className="border-t border-gray-200 bg-white px-4 pb-8 pt-4 mb-6">
        <View className="flex-row items-center">
          <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 mr-2">
            <TextInput
              className="text-[15px] text-gray-900"
              placeholder="Message"
              placeholderTextColor="#9CA3AF"
              value={userMessage}
              onChangeText={(text) => setUserMessage(text)}
              onKeyPress={handleKeyPress}
              multiline
              maxHeight={100}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-[#9902d3] items-center justify-center"
            onPress={sendMessage}
          >
            <Image 
              source={require("../../assets/icons/send.png")} 
              className="w-5 h-5" 
              style={{ tintColor: '#ffffff' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;