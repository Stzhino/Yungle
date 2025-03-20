import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, TextInput, FlatListComponent, ScrollView, Alert, Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native'
import React, {useEffect, useRef} from 'react'
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from 'expo-image-picker';

import {useGlobalContext} from '../../context/GlobalProvider'
import images from '../../constants/images'
import { useState } from 'react'
import icons from "../../constants/icons"
import { updateUser,getCurrentUser, createLabel, getUserPhotos,createImagePost } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  let { data: photos, refetch} = useAppwrite(() => getUserPhotos(user.$id));
  const {
    name,
    avatar,
    school,
    major,
    career,
    location,
    background,
    interest
  } = user;
  console.log(user.$id);
  const [form, setForm] = useState({
      newName: {name},
      newAvatar: {avatar},
      newSchool: {school},
      newMajor: {major},
      newCareer: {career},
      newLocation: {location},
      newBackground: {background},
      newInterest: "",
  })
  const [editing, setEditing] = useState(false);
  const submit = async () => {
    try{
      await updateUser(form.newName, form.newLocation, form.newMajor, form.newCareer, form.newSchool);
      const result = await getCurrentUser();
      setUser(result);
    } catch(error){
      Alert.alert('Error', error.message);
    }
  }
  const addLabel = async() => {
    try{
      await createLabel(form.newInterest);
      const result = await getCurrentUser();
      setUser(result);
    } catch(error){
      Alert.alert('Error', error.message);
    }
  }
  const [form2, setForm2]=useState({
    photo: null,
  })
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerType, setImagePickerType] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleImageUpload = async (type, source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted === false) {
          Alert.alert("Permission Required", "Camera access is required to take photos");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: type === 'avatar' ? [1, 1] : [16, 9],
          quality: 1,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
          Alert.alert("Permission Required", "Library access is required to pick photos");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: type === 'avatar' ? [1, 1] : [16, 9],
          quality: 1,
        });
      }

      if(!result.canceled){
        const imageUri = result.assets[0].uri;
        
        if(type === 'background' || type === 'avatar') {
          try {
            await updateUser(
              form.newName, 
              form.newLocation, 
              form.newMajor, 
              form.newCareer, 
              form.newSchool,
              type === 'avatar' ? imageUri : avatar,
              type === 'background' ? imageUri : background
            );
            const updatedUser = await getCurrentUser();
            setUser(updatedUser);
            Alert.alert("Success", `${type} updated successfully`);
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        } else {
          setForm2({
            ...form2,
            photo: { uri: imageUri },
          });
        }
      }
      setShowImagePicker(false);
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const ImagePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showImagePicker}
      onRequestClose={() => setShowImagePicker(false)}
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-end"
        onPress={() => setShowImagePicker(false)}
      >
        <View className="bg-white rounded-t-3xl p-6">
          <View className="items-center mb-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full mb-4"/>
            <Text className="text-xl font-psemibold">Choose Photo</Text>
          </View>
          
          <TouchableOpacity 
            className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3"
            onPress={() => handleImageUpload(imagePickerType, 'camera')}
          >
            <View className="bg-blue-100 rounded-full p-2 mr-4">
              <Image 
                source={require('../../assets/icons/camera.png')}
                className="w-6 h-6" 
                resizeMode="contain"
              />
            </View>
            <Text className="text-base font-pregular">Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3"
            onPress={() => handleImageUpload(imagePickerType, 'library')}
          >
            <View className="bg-purple-100 rounded-full p-2 mr-4">
              <Image 
                source={icons.photo} 
                className="w-6 h-6" 
                resizeMode="contain"
              />
            </View>
            <Text className="text-base font-pregular">Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="mt-2 p-4 items-center"
            onPress={() => setShowImagePicker(false)}
          >
            <Text className="text-blue-500 font-psemibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const upload = async() => {
    try {
      if(form2.photo!=null){
        await createImagePost({
          ...form2,
          userId: user.$id,
        });

        Alert.alert("Success", "Post uploaded successfully");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm2({
        photo:null,
      });
    }
    photos=await refetch();
  }

  useEffect(() => {
    if (form2.photo) {
      upload(form2.photo);
    }
  }, [form2.photo]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      enabled
    >
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS === 'ios' ? 90 : 20
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
      >
        <SafeAreaView className="relative">
          <Animated.View 
            className="relative h-[260px] -mt-20"
            style={{ opacity: fadeAnim }}
          >
            <TouchableOpacity 
              className="w-full h-[250px] active:opacity-90 transition-opacity"
              onPress={() => {
                setImagePickerType('background');
                setShowImagePicker(true);
              }}
            >
              <Image 
                source={{uri: background}}
                className="w-full h-[250px] absolute top-0 left-0"
                resizeMode='cover'
              />
              <View className="absolute top-0 left-0 w-full h-[250px] bg-black/20" />
              
              <View className="absolute bottom-4 right-4 bg-white/95 rounded-full px-4 py-2 flex-row items-center shadow-lg">
                <Image source={images.pencil} className="w-4 h-4 mr-2" resizeMode="contain"/>
                <Text className="font-psemibold text-sm text-gray-700">Change Cover</Text>
              </View>
            </TouchableOpacity>

            <View className="absolute -bottom-16 w-full items-center">
              <View className="relative">
                <Image 
                  source={{uri: avatar}}
                  className="w-[120px] h-[120px] rounded-full bg-white border-white border-4 shadow-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2.5 shadow-lg active:scale-95 transition-transform" 
                  onPress={() => {
                    setImagePickerType('avatar');
                    setShowImagePicker(true);
                  }}
                >
                  <Image source={images.pencil} className="w-5 h-5 tint-white" resizeMode="contain"/>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            className="items-center justify-center mt-20"
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View className="flex flex-row items-center">
              {editing ? (
                <TextInput 
                  className="flex text-black font-psemibold text-2xl border-2 border-blue-300 rounded-xl px-4 py-2 shadow-sm"
                  value={form.newName}
                  placeholder={name}
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(e) => setForm({ ...form, newName: e})}
                  selectionColor="#3b82f6"
                />
              ) : (
                <Text className="text-2xl font-psemibold">{name}</Text>
              )}
              <Image source={images.blueCheck} className="w-6 h-6 ml-2" resizeMode="contain"/>
            </View>
            {editing ? (
              <TextInput 
                className="flex text-gray-500 font-pregular text-base border-2 border-blue-300 rounded-xl px-4 py-2 mt-2 shadow-sm"
                value={form.newLocation}
                placeholder={location}
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newLocation: e})}
                selectionColor="#3b82f6"
              />
            ) : (
              <Text className="text-gray-500 font-pregular text-base mt-1">{location}</Text>
            )}
          </Animated.View>

          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View className="mt-8 mx-6 bg-gray-50 rounded-2xl p-6 shadow-md">
              <View className="flex flex-row items-center"> 
                <View className="bg-blue-100 rounded-full p-2.5">
                  <Image 
                    source={icons.education}
                    className="w-6 h-6"
                    resizeMode='contain'
                  />
                </View>
                <Text className="font-psemibold text-xl ml-3">Education</Text>
              </View>
              {editing ? (
                <TextInput 
                  className="flex text-gray-500 font-pregular text-base border-2 border-blue-300 rounded-xl px-4 py-2 mt-3 shadow-sm bg-white"
                  value={form.newSchool}
                  placeholder={school}
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(e) => setForm({ ...form, newSchool: e})}
                  selectionColor="#3b82f6"
                />
              ) : (
                <Text className="mt-3 text-gray-600 font-pregular text-base">{school}</Text>
              )}
            </View>

            <View className="mt-4 mx-6 bg-gray-50 rounded-2xl p-6 shadow-md">
              <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row items-center">
                  <View className="bg-red-100 rounded-full p-2.5">
                    <Image 
                      source={icons.heart}
                      className="w-5 h-5"
                      resizeMode='contain'
                    />
                  </View>
                  <Text className="font-psemibold text-xl ml-3">Interests & Career</Text>
                </View>
                <TouchableOpacity 
                  onPress={()=>{
                    setEditing(!editing)
                    if(editing){
                      submit();
                    }
                  }}
                  className={`px-4 py-2 rounded-full active:scale-95 transition-transform shadow-sm ${editing ? 'bg-blue-500' : 'bg-gray-100'}`}
                >
                  <Text className={`text-base font-psemibold ${editing ? 'text-white' : 'text-blue-500'}`}>
                    {editing ? "Save" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row my-5 items-center">
                <Text className="font-psemibold text-base w-20">Major:</Text>
                {editing ? (
                  <TextInput 
                    className="flex-1 text-gray-500 font-pregular text-base border-2 border-blue-300 rounded-xl px-4 py-2 ml-2 shadow-sm bg-white"
                    value={form.newMajor}
                    placeholder={major}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, newMajor: e})}
                    selectionColor="#3b82f6"
                  />
                ) : (
                  <Text className="font-pregular text-base ml-2 bg-white px-4 py-2 rounded-xl text-gray-600 shadow-sm" numberOfLines={1} ellipsizeMode="tail">
                    {major}
                  </Text>
                )}
              </View>

              <View className="flex flex-row my-5 items-center">
                <Text className="font-psemibold text-base w-20">Career:</Text>
                {editing ? (
                  <TextInput 
                    className="flex-1 text-gray-500 font-pregular text-base border-2 border-blue-300 rounded-xl px-4 py-2 ml-2 shadow-sm bg-white"
                    value={form.newCareer}
                    placeholder={career}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, newCareer: e})}
                    selectionColor="#3b82f6"
                  />
                ) : (
                  <Text className="font-pregular text-base ml-2 bg-white px-4 py-2 rounded-xl text-gray-600 shadow-sm" numberOfLines={1} ellipsizeMode="tail">
                    {career}
                  </Text>
                )}
              </View>

              <View className="mt-4">
                <Text className="font-psemibold text-base mb-3">Personal Interests:</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {interest.map((item) => (
                    <Text 
                      className="font-pregular text-base bg-white px-4 py-2 rounded-xl text-gray-600 shadow-sm" 
                      key={item.$id}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ maxWidth: '45%' }}
                    >
                      {item.interest_name}
                    </Text>
                  ))}
                </View>
              </View>

              {editing && (
                <View className="flex flex-row items-center gap-2 mt-4">
                  <TextInput 
                    className="flex-1 text-gray-500 font-pregular text-base border-2 border-blue-300 rounded-xl px-4 py-2 shadow-sm bg-white"
                    value={form.newInterest}
                    placeholder="Add new interest"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, newInterest: e})}
                    selectionColor="#3b82f6"
                  />
                  <TouchableOpacity 
                    onPress={()=>{
                      if(form.newInterest!=""){
                        addLabel();
                      }
                    }}
                    className="bg-blue-500 rounded-full px-4 py-2 shadow-sm active:scale-95 transition-transform"
                  >
                    <Text className="font-psemibold text-base text-white">Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View className="mt-4 mx-6 mb-6 bg-gray-50 rounded-2xl p-6 shadow-md">
              <View className="flex flex-row justify-between items-center mb-4">
                <View className="flex flex-row items-center">
                  <View className="bg-purple-100 rounded-full p-2.5">
                    <Image className="w-6 h-6" resizeMode='contain' source={icons.photo}/>
                  </View>
                  <Text className="font-psemibold text-xl ml-3">Photos</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    setImagePickerType('gallery');
                    setShowImagePicker(true);
                  }}
                  className="bg-blue-500 rounded-full px-4 py-2 shadow-sm active:scale-95 transition-transform"
                >
                  <Text className="font-psemibold text-base text-white">Add Photo</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex flex-row gap-3 flex-wrap">
                {photos.map((item) => (
                  <View key={item.$id} className="rounded-xl overflow-hidden shadow-md">
                    <Image 
                      className="w-[100px] h-[100px]" 
                      resizeMode="cover" 
                      source={{uri: item.image}}
                    />
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          <ImagePickerModal />
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Profile
