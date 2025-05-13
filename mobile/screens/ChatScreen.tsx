import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, FlatList, TextInput, Button, Image, Text, ActivityIndicator } from 'react-native';
import { API } from '../utils/api';
import { AuthContext } from '../App';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import io from 'socket.io-client';
import Constants from 'expo-constants';

export default function ChatScreen({ route }) {
  const { convId: initialConvId, userId: destUserId } = route.params as any;
  const { token, userId: myId } = useContext(AuthContext);
  const [convId, setConvId] = useState(initialConvId);
  const [messages, setMessages] = useState<any[]>([]);
  const [texte, setTexte] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const flatRef = useRef<FlatList<any>>(null);


  useEffect(() => {
    const init = async () => {
      if (initialConvId) {
        const res = await API(`/api/conversations/${initialConvId}/messages`);
        setMessages(await res.json());
      }
      setLoading(false);

      // socket
      const s = io(Constants.expoConfig?.extra?.apiHost + ':3002');
      socketRef.current = s;
      s.on('connect', () => s.emit('join', { token }));
      if (initialConvId) s.emit('joinConversation', { convId: initialConvId });
      s.on('nouveau_message', (payload: any) => {
        if (payload.conversationId === convId) setMessages((m) => [...m, payload.message]);
      });
    };
    init();
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    flatRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = async (body: FormData | { texte: string }) => {
    try {
      const res = await API(
        '/api/messages' + (convId ? `?conversationId=${convId}` : ''),
        { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) },
        body instanceof FormData
      );
      const data = await res.json();
      if (!convId) {
        setConvId(data.convId);
        socketRef.current.emit('joinConversation', { convId: data.convId });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSendText = () => {
    if (!texte.trim()) return;
    setMessages((m) => [...m, { texte, expediteur_id: myId, msg_id: Date.now() }]);
    send(
      convId
        ? { texte }
        : { texte, destinataires: [destUserId] }   
    );
    setTexte('');
  };

  const handleSendImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (res.canceled) return;
    const img = res.assets[0];
    const manip = await ImageManipulator.manipulateAsync(img.uri, [{ resize: { width: 800 } }], { compress: 0.8 });
    const fd = new FormData();
    fd.append('media', { uri: manip.uri, name: 'snap.jpg', type: 'image/jpeg' } as any);
    if (!convId) fd.append('destinataires', JSON.stringify([destUserId]));
    await send(fd);
  };

  const render = ({ item }: { item: any }) => (
    <View
      style={{
        alignSelf: item.expediteur_id === myId ? 'flex-end' : 'flex-start',
        backgroundColor: item.expediteur_id === myId ? '#dcf8c6' : '#fff',
        margin: 5,
        padding: 8,
        borderRadius: 6
      }}
    >
      {item.media_url ? (
        <Image source={{ uri: Constants.expoConfig?.extra?.apiHost + ':3002/' + item.media_url }} style={{ width: 200, height: 200 }} />
      ) : (
        <Text>{item.texte}</Text>
      )}
    </View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={messages} renderItem={render} keyExtractor={(item) =>
  item.msg_id?.toString() ?? item.tempId?.toString() ?? Math.random().toString()
} ref={flatRef} />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
        <Button title="📷" onPress={handleSendImage} />
        <TextInput style={{ flex: 1, borderWidth: 1, marginHorizontal: 5 }} value={texte} onChangeText={setTexte} />
        <Button title="Envoyer" onPress={handleSendText} />
      </View>
    </View>
  );
}
