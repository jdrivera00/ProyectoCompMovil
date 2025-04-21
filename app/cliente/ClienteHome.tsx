// app/(cliente)/ClienteHome.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

//  Interfaz para el tipo de restaurante
interface Restaurante {
  id: string;
  nombre: string;
  imagen: string;
}

export default function ClienteHome() {
  //  Tipamos el estado
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      const querySnapshot = await getDocs(collection(db, 'restaurantes'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Restaurante[];
      setRestaurantes(data);
    };

    fetchRestaurantes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/cliente/PerfilScreen')}
      >
        <Ionicons name="menu-outline" size={30} color="#000" />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Restaurantes USC</Text>
        <Text style={styles.subtitle}>¿Qué te gustaría pedir hoy?</Text>
        <View style={styles.restaurantsContainer}>
          {restaurantes.map((restaurante) => (
            <TouchableOpacity key={restaurante.id} style={styles.restaurantItem}>
              <Image
                source={{ uri: restaurante.imagen }}
                style={styles.restaurantImage}
              />
              <Text style={styles.restaurantName}>{restaurante.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50, // Ajusta el padding superior para el botón de menú!!
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  restaurantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  restaurantItem: {
    alignItems: 'center',
    marginVertical: 10,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  restaurantName: {
    marginTop: 8,
    textAlign: 'center',
  },
});