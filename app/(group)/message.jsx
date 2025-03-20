import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";
import { getMessages, createMessage } from "../../lib/appwrite";
import icons from "../../constants/icons"
import { View, Text, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const MessageScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { SessionID } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { data: messages, refetch } = useAppwrite(() => getMessages(SessionID));
  const { user } = useGlobalContext();
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const flatListRef = useRef(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (!SessionID) {
      console.error("SessionID is missing");
      return;
    }

    if (messages && messages.length > 0 && isLoading) {
      setChatMessages(messages);
      setIsLoading(false);
      scrollToBottom();

      // Identify the recipient in the chat session
      const chatSession = messages[0]?.sessionID;
      if (chatSession) {
        const otherUser = chatSession.PersonA?.$id === user?.$id ? chatSession.PersonB : chatSession.PersonA;
        setRecipient(otherUser);
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    if (!user || !user.$id) return;

    try {
      const newMessage = await createMessage(SessionID, userMessage);
      setUserMessage("");
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      refetch();
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
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
    <View className="flex-1 bg-white">
      <View style={{
        paddingTop: Constants.statusBarHeight + 8,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>

        {recipient && (
          <View className="flex-row items-center ml-4">
            <Image
              source={{ uri: recipient.avatar }}
              className="w-8 h-8 rounded-full mr-2"
            />
            <Text className="text-lg font-semibold">{recipient.username}</Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#7C3AED" className="mt-10" />
      ) : (
        <View className="flex-1 bg-gray-100 px-4 py-2">
          {/* Messages List */}
          <FlatList
            data={chatMessages}
            keyExtractor={(item, index) => item?.$id ?? index.toString()}
            renderItem={({ item }) => {
              if (!item?.Message) {
                console.log("Message missing:", item);
                return null;
              }
              const isCurrentUser = item.sender?.$id === user?.$id;
              return (
                <View className={`flex-row ${isCurrentUser ? "justify-end" : "justify-start"} my-2 items-center`}>

                  {!isCurrentUser && item.sender.avatar && (
                    <Image
                      source={{ uri: item.sender.avatar }}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}

                  <View
                    style={{
                      padding: 10,
                      maxWidth: "75%",
                      borderRadius: 20,
                      backgroundColor: isCurrentUser ? "#7C3AED" : "#E5E7EB",
                      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <Text style={{ color: isCurrentUser ? "white" : "black", fontSize: 15 }}>
                      {item.Message}
                    </Text>
                  </View>

                  {isCurrentUser && user.avatar && (
                    <Image
                      source={{ uri: user.avatar }}
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  )}
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 80 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {/* Message Input Box */}
          <View className="absolute bottom-2 left-0 right-0 bg-white px-3 py-2 border-t border-gray-300">
            <View className="flex-row bg-gray-200 rounded-full px-4 py-2 items-center mx-3">
              <TextInput
                className="flex-1 text-[16px] py-2"
                placeholder="Message here..."
                value={userMessage}
                onChangeText={(text) => setUserMessage(text)}
              />
              <TouchableOpacity
                className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center ml-2"
                onPress={sendMessage}
              >
                <Image source={require("../../assets/icons/send.png")} className="w-6 h-6 tint-white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MessageScreen;

