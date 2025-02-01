import React from 'react';
import { View, Text, StyleSheet,Image,TextInput,TouchableOpacity } from 'react-native';
import icons from '../constants/icons'
import { Router,Redirect } from 'expo-router';
export default function SearchBar({placeholder, eventHandler}) {
  return (
    <View className="w-full h-16 px-4 bg-gray-200 rounded-3xl items-center flex flex-row space-x-4">
      <Image
        source = {icons.search}
        className='w-6 h-6'
        resizeMode='contain'
      />
      <TextInput 
        placeholder={placeholder} onChangeText={eventHandler} 
        className="text-base mt-0.5 ml-4 text-black flex-1 font-pregular" 
        placeholderTextColor='grey'
      />
      <TouchableOpacity>
        <Image
            source = {icons.filter}
            className='w-6 h-6'
            resizeMode='contain'
        />
      </TouchableOpacity>
    </View>);
};

