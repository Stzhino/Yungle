import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import icons from '../../constants/icons';

const TabIcon = ({icon, color, name, focused})  => {
    return (
        <View>
            <Image 
                source = {icon}
                resizeMode = "contain"
                tintColor = {color}
                className = "w-7 h-7 mb-2"
            />
        </View>
    )
}

const LargerTabsIcon = ({icon, color, name, focused})  => {
    return (
        <View>
            <Image 
                source = {icon}
                resizeMode = "contain"
                tintColor = {color}
                className = "w-16 h-16 mb-10 bg-white rounded-full"
            />
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs screenOptions={{ tabBarInactiveTintColor: '#CDCDCD', tabBarActiveTintColor: '#9902d3', tabBarStyle:{height: 80}}}>
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon:({color, focused})=>(
                        <TabIcon
                            icon={icons.profile}
                            color = {color}
                            name = "Profile"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="group"
                options={{
                    title: 'Group',
                    headerShown: false,
                    tabBarIcon:({color, focused})=>(
                        <TabIcon
                            icon={icons.communication}
                            color = {color}
                            name = "Group"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="suggestion"
                options={{
                    title: 'Suggestion',
                    headerShown: false,
                    tabBarIcon:({color, focused})=>(
                        <LargerTabsIcon
                            icon={icons.suggestion}
                            color = {color}
                            name = "Suggestion"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Notification',
                    headerShown: false,
                    tabBarIcon:({color, focused})=>(
                        <TabIcon
                            icon={icons.notification}
                            color = {color}
                            name = "Notification"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    headerShown: false,
                    tabBarIcon:({color, focused})=>(
                        <TabIcon
                            icon={icons.menu}
                            color = {color}
                            name = "Menu"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
        <StatusBar backgroundColor='#000' style='dark'/>
    </>
  )
}

export default TabsLayout