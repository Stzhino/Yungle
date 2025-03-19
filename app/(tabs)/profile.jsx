import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, TextInput, FlatListComponent, ScrollView, Alert, Animated, ActivityIndicator, Platform, Keyboard } from 'react-native'
import React, { useEffect, useRef } from 'react'
import * as DocumentPicker from "expo-document-picker";
import { useGlobalContext } from '../../context/GlobalProvider'
import images from '../../constants/images'
import { useState } from 'react'
import icons from "../../constants/icons"
import { updateUser, getCurrentUser, createLabel, getUserPhotos, createImagePost } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  let { data: photos, refetch } = useAppwrite(() => getUserPhotos(user.$id));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();

    // Request permission for image library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();

    // Fade in animation
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
    ]).start();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  const { name, avatar, school, major, career, location, background, interest } = user || {};

  const [form, setForm] = useState({
    newName: name,
    newAvatar: { avatar },
    newSchool: school,
    newMajor: major,
    newCareer: career,
    newLocation: location,
    newBackground: { background },
    newInterest: "",
  });

  const [editing, setEditing] = useState(false);

  const submit = async () => {
    try {
      await updateUser(form.newName, form.newLocation, form.newMajor, form.newCareer, form.newSchool);
      const result = await getCurrentUser();
      setUser(result);
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const addLabel = async () => {
    try {
      await createLabel(form.newInterest);
      const result = await getCurrentUser();
      setUser(result);
      setForm(prev => ({ ...prev, newInterest: "" }));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const [form2, setForm2] = useState({
    photo: null,
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg"]
    });
    if (!result.canceled) {
      setForm2({
        ...form2,
        photo: result.assets[0],
      });
    }
  };

  const upload = async () => {
    try {
      if (form2.photo != null) {
        await createImagePost({
          ...form2,
          userId: user.$id,
        });
        Alert.alert("Success", "Photo uploaded successfully");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm2({
        photo: null,
      });
    }
    photos = await refetch();
  };

  useEffect(() => {
    if (form2.photo) {
      upload(form2.photo);
    }
  }, [form2.photo]);

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        const imageUri = result.assets[0].uri;
        
        try {
          // Update user with all existing data plus the new image
          await updateUser(
            user.name,
            user.location,
            user.major,
            user.career,
            user.school,
            type === 'avatar' ? imageUri : user.avatar,
            type === 'background' ? imageUri : user.background
          );
          
          // Refresh user data
          const updatedUser = await getCurrentUser();
          setUser(updatedUser);
          Alert.alert('Success', 'Photo updated successfully!');
        } catch (error) {
          console.error('Update error:', error);
          Alert.alert('Error', 'Failed to update photo. Please try again.');
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    } finally {
      setUploading(false);
    }
  };

  const addPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        const imageUri = result.assets[0].uri;
        
        try {
          await createImagePost({
            photo: {
              uri: imageUri,
              type: 'image/jpeg',
              name: 'photo.jpg',
            },
            userId: user.$id,
          });
          await refetch();
          Alert.alert('Success', 'Photo added successfully!');
        } catch (error) {
          Alert.alert('Error', 'Failed to add photo. Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image.');
    } finally {
      setUploading(false);
    }
  };

  const ProfileSection = ({ title, icon, children }) => (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
      className="my-4 mx-6 bg-white rounded-2xl p-4 shadow-sm"
    >
      <View className="flex-row items-center mb-4">
        <Image
          source={icon}
          className="w-6 h-6 mr-3 opacity-60"
          resizeMode='contain'
        />
        <Text className="font-semibold text-xl text-gray-800">{title}</Text>
      </View>
      {children}
    </Animated.View>
  );

  const InterestTag = ({ text }) => (
    <View className="bg-purple-50 px-4 py-2 rounded-full mr-2 mt-2 border border-purple-200">
      <Text className="text-purple-700 font-medium text-sm">{text}</Text>
    </View>
  );

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? 120 : 40}
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-gray-50"
    >
      <SafeAreaView>
        {/* Background & Profile Image */}
        <View className="relative mb-20">
          <TouchableOpacity 
            onPress={() => pickImage('background')}
            className="relative w-full h-[200px]"
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: background }}
              className="w-full h-[200px]"
              resizeMode='cover'
            />
            <View className="absolute bottom-4 right-4 bg-purple-500 rounded-full p-3">
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          
          <View className="absolute -bottom-16 w-full items-center">
            <TouchableOpacity 
              onPress={() => pickImage('avatar')}
              className="relative"
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: avatar }}
                className="w-[120px] h-[120px] rounded-full bg-white border-4 border-white shadow-lg"
                resizeMode="cover"
              />
              <View className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 shadow-sm">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Overlay */}
        {uploading && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-2">Uploading...</Text>
          </View>
        )}

        {/* Name and Location */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="items-center mb-6"
        >
          <View className="flex-row items-center">
            {editing ? (
              <TextInput
                className="text-2xl font-bold text-center border border-purple-300 rounded-xl px-4 py-2 min-w-[200px]"
                value={form.newName}
                placeholder={name}
                placeholderTextColor="#9CA3AF"
                onChangeText={(text) => setForm({ ...form, newName: text })}
                returnKeyType="next"
                autoCorrect={false}
                autoCapitalize="none"
              />
            ) : (
              <Text className="text-2xl font-bold text-gray-800">{name}</Text>
            )}
            <Image source={images.blueCheck} className="w-6 h-6 ml-2" resizeMode="contain" />
          </View>
          {editing ? (
            <TextInput
              className="text-gray-600 text-base mt-2 border border-purple-300 rounded-xl px-4 py-2 min-w-[200px]"
              value={form.newLocation}
              placeholder={location}
              placeholderTextColor="#9CA3AF"
              onChangeText={(text) => setForm({ ...form, newLocation: text })}
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize="none"
            />
          ) : (
            <Text className="text-gray-600 text-base mt-1">{location}</Text>
          )}
        </Animated.View>

        {/* Education Section */}
        <ProfileSection title="Education" icon={icons.education}>
          {editing ? (
            <View>
              <TextInput
                className="text-gray-600 text-base border border-purple-300 rounded-xl px-4 py-2 mb-2"
                value={form.newSchool}
                placeholder={school}
                placeholderTextColor="#9CA3AF"
                onChangeText={(text) => setForm({ ...form, newSchool: text })}
                returnKeyType="next"
                autoCapitalize="words"
                editable={editing}
              />
            </View>
          ) : (
            <Text className="text-gray-600 text-base mb-2">{school}</Text>
          )}
        </ProfileSection>

        {/* Interests Section */}
        <ProfileSection title="Interests" icon={icons.heart}>
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity 
              onPress={() => {
                setEditing(!editing);
                if (editing) {
                  submit();
                }
              }}
              className={`px-4 py-2 rounded-full ${editing ? 'bg-purple-500' : 'bg-purple-100'}`}
            >
              <Text className={`font-medium ${editing ? 'text-white' : 'text-purple-700'}`}>
                {editing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Major */}
          <View className="mb-4">
            <Text className="font-medium text-gray-800 mb-2">Major:</Text>
            {editing ? (
              <View>
                <TextInput
                  className="text-gray-600 border border-purple-300 rounded-xl px-4 py-2"
                  value={form.newMajor}
                  placeholder={major}
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => setForm({ ...form, newMajor: text })}
                  returnKeyType="next"
                  autoCapitalize="words"
                  editable={editing}
                />
              </View>
            ) : (
              <View className="bg-gray-100 px-4 py-2 rounded-xl">
                <Text className="text-gray-700">{major}</Text>
              </View>
            )}
          </View>

          {/* Career */}
          <View className="mb-4">
            <Text className="font-medium text-gray-800 mb-2">Career:</Text>
            {editing ? (
              <View>
                <TextInput
                  className="text-gray-600 border border-purple-300 rounded-xl px-4 py-2"
                  value={form.newCareer}
                  placeholder={career}
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => setForm({ ...form, newCareer: text })}
                  returnKeyType="next"
                  autoCapitalize="words"
                  editable={editing}
                />
              </View>
            ) : (
              <View className="bg-gray-100 px-4 py-2 rounded-xl">
                <Text className="text-gray-700">{career}</Text>
              </View>
            )}
          </View>

          {/* Personal Interests */}
          <View>
            <Text className="font-medium text-gray-800 mb-2">Personal:</Text>
            <View className="flex-row flex-wrap">
              {interest.map((item) => (
                <InterestTag key={item.$id} text={item.interest_name} />
              ))}
            </View>
          </View>

          {editing && (
            <View className="flex-row items-center mt-4">
              <View style={{ flex: 1 }}>
                <TextInput
                  className="text-gray-600 border border-purple-300 rounded-xl px-4 py-2 mr-2"
                  value={form.newInterest}
                  placeholder="Add new interest"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => setForm({ ...form, newInterest: text })}
                  returnKeyType="done"
                  autoCapitalize="words"
                  editable={editing}
                  onSubmitEditing={() => {
                    if (form.newInterest.trim() !== "") {
                      addLabel();
                    }
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (form.newInterest.trim() !== "") {
                    addLabel();
                  }
                }}
                className="bg-purple-500 rounded-xl px-4 py-2"
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </ProfileSection>

        {/* Photos Section */}
        <ProfileSection title="Photos" icon={icons.photo}>
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={addPhoto}
              className="bg-purple-100 px-4 py-2 rounded-full flex-row items-center"
              disabled={uploading}
            >
              <Ionicons name="add" size={20} color="#9333EA" />
              <Text className="text-purple-700 font-medium ml-1">Add Photo</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {photos?.map((item) => (
              <Image
                key={item.$id}
                source={{ uri: item.image }}
                className="w-[100px] h-[100px] rounded-xl"
                resizeMode="cover"
              />
            ))}
          </View>
        </ProfileSection>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Profile;