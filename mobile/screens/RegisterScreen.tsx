import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { API } from '../utils/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [mdp, setMdp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setErr('');
    try {
      await API('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, nom, motDePasse: mdp })
      });
      navigation.replace('Login');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Pseudo</Text>
      <TextInput value={nom} onChangeText={setNom} style={{ borderBottomWidth: 1 }} />
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderBottomWidth: 1 }} />
      <Text>Mot de passe</Text>
      <TextInput value={mdp} onChangeText={setMdp} secureTextEntry style={{ borderBottomWidth: 1 }} />
      {err ? <Text style={{ color: 'red' }}>{err}</Text> : null}
      {loading ? <ActivityIndicator /> : <Button title="Inscription" onPress={handleRegister} />}
    </View>
  );
}
