import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { auth, db } from "../../config/firebaseConfig"; // Asegúrate de que la ruta sea correcta
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function VisualizarMenuScreen() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (user) {
          // Obtener el logo del restaurante desde la colección 'usuarios'
          const usuariosRef = collection(db, 'usuarios');
          const qUsuario = query(usuariosRef, where('uid', '==', user.uid));
          const querySnapshotUsuario = await getDocs(qUsuario);

          if (!querySnapshotUsuario.empty) {
            const userData = querySnapshotUsuario.docs[0].data();
            if (userData && userData.ImagenRestaurante) {
              setLogoUrl(userData.ImagenRestaurante);
            }
          }

          // Obtener los productos del restaurante
          const productosRef = collection(db, 'productos');
          const qProductos = query(productosRef, where('restauranteId', '==', user.uid));
          const querySnapshotProductos = await getDocs(qProductos);
          const productos = [];
          querySnapshotProductos.forEach((doc) => {
            productos.push({ id: doc.id, ...doc.data() });
          });
          setMenuItems(productos);
        } else {
          setError("No hay usuario autenticado.");
        }
      } catch (e) {
        console.error("Error al cargar datos:", e);
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

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
    </View>
  );

  return (
    <View style={styles.container}>
      {logoUrl && (
        <Image source={{ uri: logoUrl }} style={styles.bannerImage} resizeMode="cover" />
      )}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Si no hay logo, podrías añadir un espacio en la parte superior o un título aquí
        ListHeaderComponent={() => !logoUrl ? <Text style={styles.title}>Menú</Text> : null}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  bannerImage: {
    width: '100%', // Ocupa todo el ancho de la pantalla
    height: 250,   // Altura deseada para el banner. AJUSTA ESTE VALOR según tus necesidades.
    // resizeMode: 'cover' está en el componente, asegura que la imagen cubra el área.
    marginBottom: 10, // Espacio entre el banner y la lista de productos
  },
  title: { // Estilo para el título si no hay logo
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  listContentContainer: {
    paddingHorizontal: 0, // Añade padding horizontal a la lista
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
  },
});