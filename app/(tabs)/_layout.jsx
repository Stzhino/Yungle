import { View, Text, Image, Animated, Platform } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { Tabs, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import icons from '../../constants/icons';

const TabIcon = ({icon, color, name, focused}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: focused ? 1.2 : 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                width: 70,
            }}
            className="items-center justify-center"
        >
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-5 h-5 mb-1"
            />
            <Text 
                className={`text-[10px] ${focused ? 'font-psemibold' : 'font-pregular'}`} 
                style={{ color }}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {name}
            </Text>
        </Animated.View>
    )
}

const LargerTabsIcon = ({icon, color, name, focused}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: focused ? 1.1 : 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                width: 70,
            }}
            className="items-center -mt-5"
        >
            <View className="bg-white p-3 rounded-full shadow-lg">
                <Image 
                    source={icon}
                    resizeMode="contain"
                    tintColor={color}
                    className="w-7 h-7"
                />
            </View>
            <Text 
                className={`text-[10px] mt-1 ${focused ? 'font-psemibold' : 'font-pregular'}`} 
                style={{ color }}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {name}
            </Text>
        </Animated.View>
    )
}

const TabsLayout = () => {
    return (
        <>
            <Tabs 
                screenOptions={{
                    tabBarInactiveTintColor: '#94a3b8',
                    tabBarActiveTintColor: '#9902d3',
                    tabBarStyle: {
                        height: Platform.OS === 'ios' ? 85 : 65,
                        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                        paddingTop: 10,
                        paddingHorizontal: 10,
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        elevation: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: -4,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                    tabBarLabelStyle: {
                        display: 'none'
                    }
                }}
            >
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({color, focused}) => (
                            <TabIcon
                                icon={icons.profile}
                                color={color}
                                name="Profile"
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
                        tabBarIcon: ({color, focused}) => (
                            <TabIcon
                                icon={icons.communication}
                                color={color}
                                name="Group"
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
                        tabBarIcon: ({color, focused}) => (
                            <LargerTabsIcon
                                icon={icons.suggestion}
                                color={color}
                                name="Suggestion"
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
                        tabBarIcon: ({color, focused}) => (
                            <TabIcon
                                icon={icons.notification}
                                color={color}
                                name="Notification"
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
                        tabBarIcon: ({color, focused}) => (
                            <TabIcon
                                icon={icons.menu}
                                color={color}
                                name="Menu"
                                focused={focused}
                            />
                        )
                    }}
                />
            </Tabs>
            <StatusBar backgroundColor='#fff' style='dark'/>
        </>
    )
}

export default TabsLayout