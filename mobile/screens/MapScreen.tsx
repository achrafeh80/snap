import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { API } from '../utils/api';
import { AuthContext } from '../App';

interface Story {
  story_id: string;
  localisation_lat: number;
  localisation_lon: number;
  media_url: string;
}

export default function MapScreen({ navigation }: any) {
  const { token } = useContext(AuthContext);
  const [region, setRegion] = useState<Region | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  /** Récupère les stories proches */
  const loadStories = async (lat: number, lon: number) => {
    try {
      const res = await API(`/api/stories?lat=${lat}&lon=${lon}&rayon=5`);
      const data: Story[] = await res.json();
      setStories(data);
    } catch (e: any) {
      Alert.alert('Erreur réseau', e.message);
    } finally {
      setLoading(false);
    }
  };

  /** Demande la localisation dès le montage */
  useEffect(() => {
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission nécessaire', 'Autorise la localisation pour voir les stories autour de toi.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.045,   // ~5 km
        longitudeDelta: 0.045,
      });
      await loadStories(latitude, longitude);
    })();
  }, [token]);

  /** Affiche un loader pendant la recherche GPS */
  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /** Navigue vers l’écran Story quand on tape un marqueur */
  const openStory = (story: Story) => {
    navigation.navigate('Story', { story });
  };

  return (
    <MapView style={styles.map} initialRegion={region} showsUserLocation>
      {stories.map((s) => (
        <Marker
          key={s.story_id}
          coordinate={{ latitude: s.localisation_lat, longitude: s.localisation_lon }}
          onPress={() => openStory(s)}
          title="Story"
          description="Voir la story"
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
