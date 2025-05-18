// app/(cliente)/MenuRestaurante.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function MenuRestaurante() {
  const { restauranteId, nombreRestaurante } = useLocalSearchParams();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [restauranteImagen, setRestauranteImagen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener la información del restaurante para la imagen
        const restauranteDocRef = doc(db, 'usuarios', restauranteId);
        const restauranteDocSnap = await getDoc(restauranteDocRef);
        if (restauranteDocSnap.exists() && restauranteDocSnap.data().ImagenRestaurante) {
          setRestauranteImagen(restauranteDocSnap.data().ImagenRestaurante);
        }

        // Obtener los productos del restaurante
        const productosRef = collection(db, 'productos');
        const q = query(productosRef, where('restauranteId', '==', restauranteId));
        const querySnapshot = await getDocs(q);
        const productos = [];
        querySnapshot.forEach((doc) => {
          productos.push({ id: doc.id, ...doc.data() });
        });
        setMenuItems(productos);
      } catch (e) {
        console.error("Error al cargar el menú del restaurante:", e);
        setError("Error al cargar el menú.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [restauranteId]);

  const handleAddToCart = (item) => {
    console.log('Añadir al carrito:', item.nombre);
  };

  const handleGoToCart = () => {
    console.log('Ir al carrito');
  };

  if (loading) {
    return <Text>Cargando menú...</Text>;
  }

  if (error) {
    return <Text>Error al cargar el menú: {error}</Text>;
  }

  const renderItem = ({ item }) => {
    // console.log('Item:', item); // Para inspeccionar los datos de cada item
    return (
      <View style={styles.menuItem}>
        {item.imagen && <Image source={{ uri: item.imagen || null }} style={styles.itemImage} />}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.nombre || ''}</Text>
          <Text style={styles.itemDescription}>{item.descripcion || ''}</Text>
          <Text style={styles.itemPrice}>{item.precio !== undefined ? `${item.precio} Tokens` : ''}</Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
            <Text style={styles.addToCartText}>Añadir</Text>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {restauranteImagen && (
        <Image source={{ uri: restauranteImagen || null }} style={styles.restaurantBanner} resizeMode="cover" />
      )}
      <Text style={styles.restaurantTitle}>{nombreRestaurante || ''}</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContentContainer}
      />
      <TouchableOpacity style={styles.cartButton} onPress={handleGoToCart}>
        <Ionicons name="cart-outline" size={30} color="#fff" />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>0</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  restaurantBanner: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  restaurantTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  listContentContainer: {
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    marginRight: 5,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});