// app/(cliente)/PerfilScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

function PerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && user.email) {
        const userDoc = await getDoc(doc(db, 'USUARIOS', user.email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNombre(data.nombre);
          setTokens(data.tokens || 50);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleCerrarSesion = () => {
    const auth = getAuth();
    auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Estudiante</Text>
      <View style={styles.userInfo}>
        <Text style={styles.name}>Bienvenido {nombre}</Text>
        <Text style={styles.balance}>Saldo: {tokens} Tokens</Text>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => {}}>
        <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Notificaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => {}}>
        <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleCerrarSesion}>
        <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balance: {
    fontSize: 16,
    color: 'gray',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
  },
});

export default PerfilScreen;