import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { API } from '../utils/api';

export default function CreateStoryScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    const locPerm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted || !locPerm.granted) return;
    const media = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      videoMaxDuration: 10
    });
    if (media.canceled) return;
    const coords = (await Location.getCurrentPositionAsync({})).coords;
    const fd = new FormData();
    fd.append('media', {
      uri: media.assets[0].uri,
      name: media.assets[0].type.startsWith('video') ? 'story.mp4' : 'story.jpg',
      type: media.assets[0].type === 'video' ? 'video/mp4' : 'image/jpeg'
    } as any);
    fd.append('lat', coords.latitude.toString());
    fd.append('lon', coords.longitude.toString());

    setLoading(true);
    try {
      await API('/api/stories', { method: 'POST', body: fd }, true);
      Alert.alert('Story publiée !');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? <ActivityIndicator /> : <Button title="Prendre une photo / vidéo" onPress={capture} />}
    </View>
  );
}
