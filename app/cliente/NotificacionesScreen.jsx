// app/(cliente)/NotificacionesScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificacionesScreen() {
  const [notificaciones, setNotificaciones] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const notificacionesRef = collection(db, 'notificaciones');
    const q = query(notificacionesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nuevasNotificaciones = [];
      querySnapshot.forEach((doc) => {
        nuevasNotificaciones.push({ id: doc.id, ...doc.data() });
      });
      setNotificaciones(nuevasNotificaciones);
    });

    // Nos desuscribimos del listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      <Text style={styles.message}>{item.mensaje}</Text>
    </View>
  );

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    }
    return 'Fecha no disponible';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Notificaciones</Text>
      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  notificationItem: {
    paddingVertical: 15,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});