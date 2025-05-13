import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  readonly mine: boolean;
  readonly texte?: string;
  readonly mediaUrl?: string;
  readonly date: string;
}

export default function MessageBubble({ mine, texte, mediaUrl, date }: Props) {
  return (
    <View style={[styles.container, mine ? styles.mine : styles.theirs]}>
      {mediaUrl ? (
        <Image source={{ uri: mediaUrl }} style={styles.image} />
      ) : (
        <Text style={styles.text}>{texte}</Text>
      )}
      <Text style={styles.time}>{new Date(date).toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    borderRadius: 8,
    padding: 6,
  },
  mine: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  theirs: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  text: { fontSize: 16 },
  time: { fontSize: 10, color: '#555', alignSelf: 'flex-end' },
  image: { width: 220, height: 220, borderRadius: 8 },
});