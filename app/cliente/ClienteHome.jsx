// app/(cliente)/ClienteHome.jsx
import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const PLACEHOLDER_IMAGE = ""; // Reemplaza con la URL de tu imagen de marcador de posición

export default function ClienteHome() {
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchRestaurantes();
  }, []);

  const fetchUserData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        const userDocRef = doc(db, 'usuarios', user.uid); // Usamos user.uid como ID del documento
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setNombreUsuario(userData.nombre || 'Usuario');
        } else {
          console.log("No se encontró el documento del usuario con UID:", user.uid, "en 'usuarios'");
          setNombreUsuario(user.email.split('@')[0]); // Fallback
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setNombreUsuario(user.email.split('@')[0]); // Fallback
      }
    } else {
      setNombreUsuario('Invitado');
    }
  };

  const fetchRestaurantes = async () => {
    try {
      const q = query(collection(db, 'usuarios'), where('rol', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        UID: doc.data().uid, // Asegúrate de que este campo exista y contenga el UID del admin
        nombre: doc.data().NombreRestaurante || 'Nombre no disponible',
        imagen: doc.data().ImagenRestaurante || PLACEHOLDER_IMAGE, // Usamos ImagenRestaurante
        ...doc.data(),
      }));
      setRestaurantes(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los restaurantes.');
      console.error("Error fetching restaurantes:", error);
    }
  };

  const handleMenuPress = () => {
    router.push('/cliente/PerfilScreen');
  };

  const handleRestaurantPress = (restauranteId, nombreRestaurante) => {
    router.push({
      pathname: '/cliente/MenuRestaurante',
      params: { restauranteId: restauranteId, nombreRestaurante: nombreRestaurante },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="menu-outline" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Restaurantes USC</Text>
      <Text style={styles.welcomeText}>¿Qué te gustaría pedir hoy, {nombreUsuario}?</Text>
      <ScrollView style={styles.restaurantsContainer}>
        {restaurantes.map((restaurante) => (
          <TouchableOpacity
            key={restaurante.id}
            style={styles.restaurantItem}
            onPress={() => handleRestaurantPress(restaurante.UID, restaurante.nombre)}
          >
            <Image
              source={{ uri: restaurante.imagen }}
              style={styles.restaurantImage}
            />
            <Text style={styles.restaurantName}>{restaurante.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  restaurantsContainer: {
    flex: 1,
    marginTop: 20,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  restaurantName: {
    fontSize: 16,
  },
});
