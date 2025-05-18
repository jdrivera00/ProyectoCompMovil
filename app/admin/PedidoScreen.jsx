// app/admin/PedidoScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from 'expo-router';

export default function PedidoScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const pedidosRef = collection(db, "pedidos");
        const q = query(pedidosRef, orderBy("fechaPedido", "desc")); // Ordenar por fechaPedido

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const pedidosData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPedidos(pedidosData);
          setLoading(false);
        }, (err) => {
          console.error("Error al obtener los pedidos:", err);
          setError("Error al cargar los pedidos.");
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (e) {
        console.error("Error al configurar el listener:", e);
        setError("Error al cargar los pedidos.");
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const renderPedidoItem = ({ item }) => (
    <View style={styles.pedidoItem}>
      <Text style={styles.pedidoId}>Pedido ID: {item.id}</Text>
      <Text>Cliente: {item.clienteNombre}</Text>
      <Text>Fecha: {item.fechaPedido?.toDate ? item.fechaPedido.toDate().toLocaleDateString() : new Date(item.fechaPedido).toLocaleDateString()}</Text>
      <Text>Total: {item.costoTotal} Tokens</Text>
      {/* Aquí puedes mostrar más detalles del pedido */}
    </View>
  );

  const handleRegresar = () => {
    router.push('/admin/AdminRestauranteView');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos Recibidos</Text>
      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay pedidos por mostrar</Text>
          <TouchableOpacity style={styles.goBackButton} onPress={handleRegresar}>
            <Text style={styles.goBackButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderPedidoItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  pedidoItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  goBackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});