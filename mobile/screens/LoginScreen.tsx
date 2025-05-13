import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../App';
import { API } from '../utils/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await API('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, motDePasse: mdp })
      });
      const { token } = await res.json();
      await SecureStore.setItemAsync('TOKEN', token);
      setToken(token);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderBottomWidth: 1 }} />
      <Text>Mot de passe</Text>
      <TextInput value={mdp} onChangeText={setMdp} secureTextEntry style={{ borderBottomWidth: 1 }} />
      {err ? <Text style={{ color: 'red' }}>{err}</Text> : null}
      {loading ? <ActivityIndicator /> : <Button title="Connexion" onPress={handleLogin} />}
      <Button title="Créer un compte" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
