// app/(cliente)/PedidosCliente.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

function PedidosCliente() {
  const { clienteUid } = useLocalSearchParams();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        if (clienteUid) {
          const pedidosRef = collection(db, 'pedidos');
          const q = query(pedidosRef, where('clienteUid', '==', clienteUid));
          const querySnapshot = await getDocs(q);
          const pedidosData = [];

          querySnapshot.forEach((doc) => {
            pedidosData.push({ id: doc.id, ...doc.data() });
          });

          // Ordenar manualmente por fechaPedido descendente
          pedidosData.sort((a, b) => {
            const fechaA = a.fechaPedido?.toDate?.() || new Date(0);
            const fechaB = b.fechaPedido?.toDate?.() || new Date(0);
            return fechaB - fechaA;
          });

          setPedidos(pedidosData);
        }
      } catch (e) {
        console.error("Error al cargar los pedidos del cliente:", e);
        setError("Error al cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [clienteUid]);

  const renderItem = ({ item }) => (
    <View style={styles.pedidoItem}>
      <Text style={styles.pedidoId}>Pedido #{item.id.substring(0, 8)}</Text>
      <Text style={styles.pedidoFecha}>
        Fecha: {item.fechaPedido?.toDate?.().toLocaleDateString() || 'No disponible'}
      </Text>
      <Text style={styles.pedidoTotal}>Total: {item.costoTotal} Tokens</Text>
      <Text style={styles.pedidoEstado}>Estado: {item.estado}</Text>
      {item.resumenPedido &&
        item.resumenPedido.map((producto, index) => (
          <Text key={index} style={styles.pedidoProducto}>
            {producto.nombre} ({producto.cantidad}) - {producto.precioTotal} Tokens
          </Text>
        ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando tus pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>
      {pedidos.length > 0 ? (
        <FlatList data={pedidos} keyExtractor={(item) => item.id} renderItem={renderItem} />
      ) : (
        <Text style={styles.noPedidosText}>No has realizado ningún pedido aún.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  pedidoItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pedidoFecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pedidoTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  pedidoEstado: {
    fontSize: 15,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pedidoProducto: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  noPedidosText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PedidosCliente;
