import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchInput from '../../components/Searchinput';
import { getMessages } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import MessageCards from '../../components/MessageCards';
import { useGlobalContext } from '../../context/GlobalProvider';
import { createNotification } from '../../lib/appwrite';
import { useRefetchContext } from '../../context/RefetchProvider';

const filterIcon = require('../../assets/icons/filter.png');
const searchIcon = require('../../assets/icons/search.png');

const filterOptions = [
  { id: '1', label: 'Most Recent' },
  { id: '2', label: 'Most Active' },
  { id: '3', label: 'My Favorites' },
  { id: '4', label: 'Hidden' }
];

const Group = () => {
  const { data: messages, refetch } = useAppwrite(getMessages);
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { notifRefetch, setNotifRefetch } = useRefetchContext();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchText, setSearchText] = useState('');

  const toggleFilter = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((item) => item !== filter)
        : [...prevFilters, filter]
    );
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="my-4 px-4">
        <View className="flex-row items-center bg-gray-100 p-3 rounded-full">
          <Image source={searchIcon} style={{ width: 18, height: 18, marginRight: 8 }} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-base text-gray-900"
          />
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#E5E7EB',
              borderRadius: 20,
              marginLeft: 10
            }}
          >
            <Image source={filterIcon} style={{ width: 20, height: 20, marginRight: 6 }} />
            <Text style={{ fontSize: 14, color: '#6B7280' }}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 15,
              width: '80%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              Select Filters
            </Text>
            
            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: 'black',
                width: '100%',
                marginBottom: 15,
              }}
            />

            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: selectedFilters.includes(option.label) ? '#8B5CF6' : '#E5E7EB',
                  borderRadius: 10,
                  marginVertical: 8,
                }}
                onPress={() => toggleFilter(option.label)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: selectedFilters.includes(option.label) ? 'white' : 'black',
                    textAlign: 'center',
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#EF4444',
                borderRadius: 10,
              }}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text className="text-white text-center text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <MessageCards profile={item.sender} message={item.Message} time={item.time} />
        )}
      />
    </SafeAreaView>
  );
};

export default Group;