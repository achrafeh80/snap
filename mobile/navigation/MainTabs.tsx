import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatStack from './ChatStack';
import MapScreen from '../screens/MapScreen';
import CreateStoryScreen from '../screens/CreateStoryScreen';
import StoryScreen from '../screens/StoryScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatStack} options={{ headerShown: false }} />
      <Tab.Screen name="Carte" component={MapScreen} options={{ headerShown:false }} />
      <Tab.Screen name="Story" component={StoryScreen} options={{ tabBarButton: () => null, headerShown:false }} />
    </Tab.Navigator>
  );
}
