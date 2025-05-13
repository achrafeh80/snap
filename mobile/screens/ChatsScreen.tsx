import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { API } from '../utils/api';
import { AuthContext } from '../App';

export default function ChatsScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const load = async () => {
    setRefreshing(true);
    try {
      const [friendsRes, convRes] = await Promise.all([
        API('/api/users/me/friends'),
        API('/api/conversations')
      ]);
      const friends = await friendsRes.json();
      const convs = await convRes.json();

      const merged: any[] = [];
      friends.forEach((f: any) => {
        const conv = convs.find((c: any) => c.membres.length === 2 && c.membres.includes(f.user_id));
        merged.push(
          conv
            ? { type: 'conversation', ...conv, title: f.nom }
            : { type: 'friend', userId: f.user_id, title: f.nom }
        );
      });
      convs
        .filter((c: any) => c.membres.length > 2)
        .forEach((c: any) => merged.push({ type: 'conversation', ...c, title: c.titre || 'Groupe' }));

      setItems(merged);
    } catch (e) {
      console.warn(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const render = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ padding: 15, borderBottomWidth: 1 }}
      onPress={() =>
        navigation.navigate('Chat', item.type === 'friend'
          ? { userId: item.userId, title: item.title }
          : { convId: item.conv_id, title: item.title })
      }
    >
      <Text style={{ fontWeight: '600' }}>{item.title}</Text>
      {item.dernierMessage && (
        <Text numberOfLines={1} style={{ color: 'gray' }}>
          {item.dernierMessage.media_url ? '📷 Photo' : item.dernierMessage.texte}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      renderItem={render}
      keyExtractor={(_, i) => i.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
    />
  );
}
