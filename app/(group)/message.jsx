import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";
import { getMessages, createMessage } from "../../lib/appwrite";
import icons from "../../constants/icons"
import { View, Text, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Image, Animated, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { LinearGradient } from 'expo-linear-gradient';
import MessageBubble from "../../components/MessageBubble";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

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
  const [showOptions, setShowOptions] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(false);

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

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }

      // Request audio permissions
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      setRecordingPermission(audioStatus === 'granted');
      if (audioStatus !== 'granted') {
        alert('Sorry, we need audio permissions to record voice messages!');
      }

      // Request media library permissions
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== 'granted') {
        alert('Sorry, we need media library permissions to access photos!');
      }
    })();
  }, []);

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

  // Handle taking a photo with camera
  const handleCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled) {
        // Handle the captured image
        // You'll need to implement image upload to your backend here
        console.log('Camera photo taken:', result.assets[0].uri);
        // TODO: Upload image and send as message
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo');
    }
  };

  // Handle picking a photo from library
  const handlePhotoPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: false,
        allowsEditing: true,
      });

      if (!result.canceled) {
        // Handle the selected image
        // You'll need to implement image upload to your backend here
        console.log('Photo selected:', result.assets[0].uri);
        // TODO: Upload image and send as message
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      alert('Failed to pick photo');
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      if (!recordingPermission) {
        alert('Please grant audio recording permissions');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      // Handle the recorded audio
      // You'll need to implement audio upload to your backend here
      console.log('Recording stopped, uri:', uri);
      // TODO: Upload audio and send as message
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('Failed to stop recording');
    }
  };

  // Handle emoji keyboard
  const showEmojiKeyboard = () => {
    if (Platform.OS === 'ios') {
      // For iOS, we need to focus the input and switch to emoji keyboard
      inputRef.current?.focus();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setNativeProps({
            keyboardType: 'default',
            keyboardAppearance: 'light'
          });
        }
      }, 100);
    } else {
      // For Android
      if (inputRef.current) {
        inputRef.current.blur();  // First blur to reset keyboard state
        setTimeout(() => {
          inputRef.current?.focus();  // Then focus to show keyboard
        }, 100);
      }
    }
  };

  const inputRef = useRef(null);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={{ flex: 1 }}
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
              transform: [{ translateY: slideAnim }],
              flex: 1
            }}
            className="flex-1"
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
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          </Animated.View>
        )}

        {/* Message Input */}
        <View className="border-gray-100 bg-white">
          <View className="flex-row items-center px-2 py-7">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setShowOptions(!showOptions)}
                className="w-8 h-8 items-center justify-center mr-2"
              >
                <Ionicons 
                  name="chevron-forward"
                  size={24} 
                  color="#0084ff" 
                />
              </TouchableOpacity>

              {showOptions && (
                <View className="flex-row items-center mr-2">
                  <TouchableOpacity 
                    className="w-8 h-8 items-center justify-center"
                    onPress={handleCamera}
                  >
                    <Ionicons name="camera-outline" size={24} color="#0084ff" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-8 h-8 items-center justify-center mx-1"
                    onPress={handlePhotoPicker}
                  >
                    <Ionicons name="image-outline" size={24} color="#0084ff" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-8 h-8 items-center justify-center"
                    onPress={isRecording ? stopRecording : startRecording}
                  >
                    <Ionicons 
                      name={isRecording ? "stop-circle-outline" : "mic-outline"} 
                      size={24} 
                      color={isRecording ? "#ff0000" : "#0084ff"} 
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View className={`flex-1 bg-[#f2f2f7] rounded-full px-4 flex-row items-center mx-2`}>
              <TextInput
                ref={inputRef}
                className="flex-1 text-[17px] text-gray-900 py-2.5"
                placeholder="Message"
                placeholderTextColor="#65676B"
                value={userMessage}
                onChangeText={(text) => setUserMessage(text)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowOptions(false)}
                multiline
                maxHeight={100}
                blurOnSubmit={false}
                textAlignVertical="center"
                keyboardType="default"
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
              />
            </View>

            {userMessage.trim() ? (
              <TouchableOpacity
                className="w-8 h-8 items-center justify-center"
                onPress={sendMessage}
              >
                <Image 
                  source={require("../../assets/icons/send.png")} 
                  className="w-5 h-5" 
                  style={{ tintColor: '#0084ff' }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="w-8 h-8 items-center justify-center"
                onPress={showEmojiKeyboard}
                activeOpacity={0.7}
              >
                <Ionicons name="happy-outline" size={24} color="#0084ff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;