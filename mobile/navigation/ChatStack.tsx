import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsScreen from '../screens/ChatsScreen';
import ChatScreen from '../screens/ChatScreen';

type ChatStackParamList = {
  ChatsList: undefined;
  Chat: { title: string };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();
export default function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatsList" component={ChatsScreen} options={{ title: 'Chats' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params?.title })} />
    </Stack.Navigator>
  );
}
