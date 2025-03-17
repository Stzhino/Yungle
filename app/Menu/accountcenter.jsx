import { View, Text, ScrollView, Switch, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const AccountCenter = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    twoFactorEnabled: false,
    emergencyContact: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const handleUpdatePassword = () => {
    if (settings.newPassword !== settings.confirmNewPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
    // console.log('Updating password:', settings.newPassword); 
    Alert.alert('Success', 'Password updated successfully!');
    setSettings({ ...settings, password: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleUpdate2FA = () => {

    // console.log('Updating 2FA:', settings.twoFactorEnabled); 
    Alert.alert('Success', 'Two-factor authentication updated successfully!');
  };

  const handleUpdateEmergencyContact = () => {
    if (!settings.emergencyContact) {
      Alert.alert('Error', 'Please enter an emergency contact.');
      return;
    }
    // console.log('Updating emergency contact:', settings.emergencyContact); 
    Alert.alert('Success', 'Emergency contact updated successfully!');
    setSettings({ ...settings, emergencyContact: '' });
  };

  const handleUpdateSecurityQuestion = () => {
    if (!settings.securityQuestion || !settings.securityAnswer) {
      Alert.alert('Error', 'Please enter both a security question and answer.');
      return;
    }
    // console.log('Updating security question:', settings.securityQuestion); 
    // console.log('Updating security answer:', settings.securityAnswer);
    Alert.alert('Success', 'Security question and answer updated successfully!');
    setSettings({ ...settings, securityQuestion: '', securityAnswer: '' });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6D28D9" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-4">Account Center</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Change Password</Text>
          <TextInput
            className="p-4 bg-gray-50 rounded-lg mb-3"
            placeholder="Current Password"
            secureTextEntry
            value={settings.password}
            onChangeText={(text) => setSettings({ ...settings, password: text })}
          />
          <TextInput
            className="p-4 bg-gray-50 rounded-lg mb-3"
            placeholder="New Password"
            secureTextEntry
            value={settings.newPassword}
            onChangeText={(text) => setSettings({ ...settings, newPassword: text })}
          />
          <TextInput
            className="p-4 bg-gray-50 rounded-lg mb-3"
            placeholder="Confirm New Password"
            secureTextEntry
            value={settings.confirmNewPassword}
            onChangeText={(text) => setSettings({ ...settings, confirmNewPassword: text })}
          />
          <TouchableOpacity
            onPress={handleUpdatePassword}
            className="bg-purple-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Update Password</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Two-Factor Authentication</Text>
          <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
            <View>
              <Text className="font-semibold">Enable 2FA</Text>
              <Text className="text-gray-500 text-sm">
                Add an extra layer of security to your account
              </Text>
            </View>
            <Switch
              value={settings.twoFactorEnabled}
              onValueChange={() =>
                setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled })
              }
              trackColor={{ false: '#767577', true: '#9902d3' }}
              thumbColor={settings.twoFactorEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity
            onPress={handleUpdate2FA}
            className="bg-purple-500 p-3 rounded-lg mt-3"
          >
            <Text className="text-white text-center font-semibold">Update 2FA</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Emergency Contact</Text>
          <TextInput
            className="p-4 bg-gray-50 rounded-lg mb-3"
            placeholder="Emergency Contact Number"
            keyboardType="phone-pad"
            value={settings.emergencyContact}
            onChangeText={(text) => setSettings({ ...settings, emergencyContact: text })}
          />
          <TouchableOpacity
            onPress={handleUpdateEmergencyContact}
            className="bg-purple-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Update Emergency Contact</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Security Question</Text>
          <TextInput
            className="p-4 bg-gray-50 rounded-lg mb-3"
            placeholder="Security Question (e.g., What is your mother's maiden name?)"
            value={settings.securityQuestion}
            onChangeText={(text) => setSettings({ ...settings, securityQuestion: text })}
          />
          <TextInput
            className="p-4 bg-gray-50 rounded-lg mb-3"
            placeholder="Answer"
            secureTextEntry
            value={settings.securityAnswer}
            onChangeText={(text) => setSettings({ ...settings, securityAnswer: text })}
          />
          <TouchableOpacity
            onPress={handleUpdateSecurityQuestion}
            className="bg-purple-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Update Security Question</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountCenter;