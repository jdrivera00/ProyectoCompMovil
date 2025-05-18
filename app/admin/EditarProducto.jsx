import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; // Importa el icono de editar

export default function EditarProducto() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cargarMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (user) {
          const productosRef = collection(db, 'productos');
          const q = query(productosRef, where('restauranteId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const productos = [];
          querySnapshot.forEach((doc) => {
            productos.push({ id: doc.id, ...doc.data() });
          });
          setMenuItems(productos);
        } else {
          setError("No hay usuario autenticado.");
        }
      } catch (e) {
        console.error("Error al cargar el menú:", e);
        setError("Error al cargar el menú.");
      } finally {
        setLoading(false);
      }
    };

    cargarMenu();
  }, []);

  const handleEditarProducto = (id) => {
    router.push(`/admin/EditandoProducto?id=${id}`)
  };

  if (loading) {
    return <Text>Cargando menú...</Text>;
  }

  if (error) {
    return <Text>Error al cargar el menú: {error}</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      {item.imagen && <Image source={{ uri: item.imagen }} style={styles.itemImage} />}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemDescription}>{item.descripcion}</Text>
        <Text style={styles.itemPrice}>{item.precio} Tokens</Text>
      </View>
      <TouchableOpacity onPress={() => handleEditarProducto(item.id)} style={styles.editButton}>
        <Feather name="edit" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrar Productos</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between', // Para alinear el botón de edición a la derecha
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
  },
  editButton: {
    padding: 8,
  },
});