
import React from 'react';
import { View, Image } from 'react-native';
import { Video , ResizeMode } from 'expo-av';
import Constants from 'expo-constants';

export default function StoryScreen({ route }) {
  const { story } = route.params;
  const uri = Constants.expoConfig?.extra?.apiHost + ':3003/' + story.media_url;
  const isVideo = uri.endsWith('.mp4') || uri.endsWith('.mov');
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {isVideo ? (
        <Video
          source={{ uri }}
          style={{ flex: 1 }}
          resizeMode={ResizeMode.CONTAIN}
        />      ) : (
        <Image source={{ uri }} style={{ flex: 1 }} resizeMode="contain" />
      )}
    </View>
  );
}
