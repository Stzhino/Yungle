import React from 'react';
import { View, Text, StyleSheet,Image,TextInput,TouchableOpacity } from 'react-native';
import icons from '../constants/icons'
import { Router,Redirect } from 'expo-router';
export default function SearchBar({placeholder, eventHandler}) {
  return (<View className='bg-[#d3d3d3] w-90% h-10 flex-row items-center rounded-2xl '>
    <Image source={require('../assets/icons/search.png')} 
    className='w-7 h-7 ml-7 tint-gray-500' />
    <TextInput placeholder={placeholder} onChangeText={eventHandler} 
    className='className="h-[90%] w-[65%] ml-[30px] text-gray-500 text-[16px]' 
    placeholderTextColor='grey'/>
    <TouchableOpacity>
                <Image
                    source = {icons.filter}
                    className='w-6 h-6 mr-5 '
                    resizeMode='contain'
                />
            </TouchableOpacity>
  </View>);
};

