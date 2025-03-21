import { View, Text, Image } from "react-native";

const MessageBubble = ({ message, isCurrentUser }) => {
  const { time, read, sender, Message, sessionID } = message;
  const formatedTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View className={`w-full flex-row ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
      {!isCurrentUser && (
        <View className="w-[30px] h-[30px] rounded-full overflow-hidden mr-2">
          <Image source={{ uri: sender.avatar }} className="w-full h-full" />
        </View>
      )}
      <View className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <View 
          className={`px-4 py-2 rounded-2xl ${
            isCurrentUser 
              ? 'bg-[#9902d3] rounded-tr-md' 
              : 'bg-[#E9E9EB] rounded-tl-md'
          }`}
        >
          <Text 
            className={`text-[15px] ${
              isCurrentUser ? 'text-white' : 'text-black'
            }`}
          >
            {Message}
          </Text>
        </View>
        {/* Time */}
        <Text className="text-[10px] text-gray-500 mt-1">
          {formatedTime}
        </Text>
      </View>
      {isCurrentUser && (
        <View className="w-[30px] h-[30px] rounded-full overflow-hidden ml-2">
          <Image source={{ uri: sender.avatar }} className="w-full h-full" />
        </View>
      )}
    </View>
  );
};

export default MessageBubble;