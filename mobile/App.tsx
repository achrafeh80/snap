import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';

import { decode as atob } from 'base-64';                


export const AuthContext = React.createContext<{
  token: string | null;
  userId: string | null;
  setToken: (t: string | null) => void;
}>({
  token: null,
  userId: null,
  setToken: () => {}
});

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('TOKEN').then((t) => {
      setToken(t);
      setLoading(false);
    });
  }, []);

  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const authContextValue = React.useMemo(() => ({ token, userId, setToken }), [token, userId]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer
        theme={DefaultTheme}
        linking={{ prefixes: [] }}           
      >
        {token ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
