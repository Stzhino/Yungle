import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, TextInput, FlatListComponent, ScrollView, Alert } from 'react-native'
import React, {useEffect} from 'react'
import * as DocumentPicker from "expo-document-picker";

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
  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg"]
    });
    if(!result.canceled){
      setForm2({
        ...form2,
        photo:result.assets[0],
      });
    }
    else{
      setTimeout(()=> {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));}, 100);
    }
  }
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
    <ScrollView className="h-full">
        <SafeAreaView className="relative">
          <Image 
            source={{uri: background}}
            className="w-full h-[200px] absolute top-0 left-0"
            resizeMode='cover'
          />
          <View className="items-center justify-center mt-24">
            <Image 
              source={{uri: avatar}}
              className="w-[100px] h-[100px] rounded-full bg-white border-white border-4"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center mt-2">
              {editing ? 
              (<TextInput 
                className="flex text-black font-psemibold text-2xl border border-blue-300 rounded-xl px-3 py-1"
                value={form.newName}
                placeholder={name}
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newName: e})}
              />):(<Text className="text-2xl font-psemibold">{name}</Text>)}
              <Image source={images.blueCheck} className="w-8 h-8 ml-2" resizeMode="contain"/>
            </View>
            {editing ? 
              (<TextInput 
                className="flex text-gray-500 font-pregular text-base border border-blue-300 rounded-xl px-3 py-1 mt-1"
                value={form.newLocation}
                placeholder={location}
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newLocation: e})}
              />):(<Text className="text-gray-500 font-pregular text-base">{location}</Text>)}
          </View>
          <View className="my-4 mx-8">
            <View className="flex flex-row items-center"> 
              <Image 
                source={icons.education}
                className="w-6 h-6 mr-3 opacity-50"
                resizeMode='contain'
              />
              <Text className="font-psemibold text-xl">School or University</Text>
            </View>
            {editing ? 
              (<TextInput 
                className="flex text-gray-500 font-pregular text-base border border-blue-300 rounded-xl px-3 py-1 mt-1"
                value={form.newSchool}
                placeholder={school}
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newSchool: e})}
              />):(<Text className="mt-2 text-gray-500 font-pregular text-base">{school}</Text>)}
          </View>
          <View className="my-4 mx-8">
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center">
                <Image 
                  source={icons.heart}
                  className="w-5 h-5 mr-4 opacity-50"
                  resizeMode='contain'
                />
                <Text className="font-psemibold text-xl">Interest</Text>
              </View>
              <TouchableOpacity onPress={()=>{
                setEditing(!editing)
                if(editing){
                  submit();
                }
                }}>
                <Text className="text-blue-500 text-base font-pregular">{editing ? "Save" : "Edit"}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row my-5 items-center">
              <Text className="font-psemibold text-base">Major:</Text>
              {editing ? 
              (<TextInput 
                className="flex-1 text-gray-500 font-pregular text-base border border-blue-300 rounded-xl px-3 py-1 ml-2"
                value={form.newMajor}
                placeholder={major}
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newMajor: e})}
              />):
              <Text className="font-pregular text-base ml-2 border-2 border-gray-300 px-4 py-1 rounded-2xl">{major}</Text>}
            </View>
            <View className="flex flex-row my-5 items-center">
              <Text className="font-psemibold text-base">Career:</Text>
              {editing ? 
              (<TextInput 
                className="flex-1 text-gray-500 font-pregular text-base border border-blue-300 rounded-xl px-3 py-1 ml-2"
                value={form.newCareer}
                placeholder={career}
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newCareer: e})}
              />):
              <Text className="font-pregular text-base ml-2 border-2 border-gray-300 px-4 py-1 rounded-2xl">{career}</Text>}
            </View>
            <View className="flex flex-row flex-wrap items-center my-3">
              <Text className="font-psemibold text-base mr-2">Personal:</Text>
              {interest.map((item) => (
                <Text className="font-pregular text-base mr-2 mt-2 border-2 border-gray-300 px-4 py-1 rounded-2xl"key={item.$id}>{item.interest_name}</Text>
              ))}
            </View>
            {editing? (<View className="flex flex-row items-center gap-2">
              <TextInput className="flex-1 text-gray-500 font-pregular text-base border border-blue-300 rounded-xl px-3 py-1"
                value={form.newInterest}
                placeholder="Name of interest"
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setForm({ ...form, newInterest: e})}
              />
              <TouchableOpacity onPress={()=>{
                if(form.newInterest!=""){
                  addLabel();
                }
              }}className="bg-blue-200 rounded-full px-3 py-2"><Text className="font-pregular text-base">Add</Text></TouchableOpacity>
              </View>):(<></>)}
          </View>
          <View className="my-4
          mx-8">
            <View className="flex flex-row justify-between">
              <View className="flex flex-row">
                <Image className="w-6 h-6 mr-4 opacity-50" resizeMode='contain' source={icons.photo}/>
                <Text className="font-psemibold text-xl">Photos</Text>
              </View>
              <TouchableOpacity onPress={()=>{
                openPicker();
              }}>
                <Text className="font-pregular text-base text-blue-500">+ Add</Text>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row gap-3 flex-wrap">
              {photos.map((item) => (
                  <Image className="w-[100px] h-[100px]" resizeMode="contain" key={item.$id} source={{uri: item.image}}/>
              ))}
            </View>
          </View>
          <TouchableOpacity className="absolute top-[218px] left-[214px]" onPress={()=>{console.log("Profile Picture");}}>
            <Image source={images.pencil} className="w-8 h-8 bg-blue-200 rounded-full border border-1 border-white p-2" resizeMode="contain"/>
          </TouchableOpacity>
          <TouchableOpacity className="absolute top-[50px] right-[15px]" onPress={()=>{console.log("Background Picture");}}>
            <Image source={images.pencil} className="w-8 h-8 rounded-full p-2" resizeMode="contain"/>
          </TouchableOpacity>
        </SafeAreaView>
    </ScrollView>
  )
}

export default Profile