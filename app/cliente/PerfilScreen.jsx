import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function PerfilScreen() {
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [tokens, setTokens] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchUserDataAndTokens(user.uid);
    }
  }, []);

  const fetchUserDataAndTokens = async (uid) => {
    if (uid) {
      try {
        const userDocRef = doc(db, 'usuarios', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setNombreUsuario(userData.nombre || 'Usuario');
          setTokens(userData.tokens || 0);
        } else {
          console.log("No se encontró el documento del usuario con UID:", uid, "en 'usuarios'");
          setNombreUsuario(user?.email.split('@')[0] || 'Usuario');
          setTokens(0);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setNombreUsuario(user?.email.split('@')[0] || 'Usuario');
        setTokens(0);
      }
    } else {
      setNombreUsuario('Invitado');
      setTokens(0);
    }
  };

  const handleCerrarSesion = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  const handleRecargarTokensPress = () => {
    if (userId) {
      router.push({
        pathname: '/cliente/RecargarTokensScreen',
        params: { clienteUid: userId },
      });
    } else {
      Alert.alert('Error', 'No se pudo obtener la ID del usuario.');
    }
  };

  const handleMisPedidosPress = () => {
    if (userId) {
      router.push({
        pathname: '/cliente/PedidosCliente',
        params: { clienteUid: userId },
      });
    } else {
      Alert.alert('Error', 'No se pudo obtener la ID del usuario para ver los pedidos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido</Text>
      <Text style={styles.userName}>{nombreUsuario}</Text>

      <TouchableOpacity style={styles.item} onPress={handleRecargarTokensPress}>
        <Ionicons name="cash-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Saldo: {tokens} Tokens</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.chevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleMisPedidosPress}>
        <Ionicons name="list-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Mis Pedidos</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="gray" style={styles.chevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/cliente/EditarPerfilScreen')}>
        <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
        <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
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
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
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
    flex: 1,
  },
  chevron: {
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButtonText: {
    fontSize: 18,
    marginLeft: 15,
  },
});
