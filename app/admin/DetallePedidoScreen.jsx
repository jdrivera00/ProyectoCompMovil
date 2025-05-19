// app/admin/DetallePedidoScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"; // Importa Alert
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DetallePedidoScreen() {
  const { pedidoId } = useLocalSearchParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadoPedido, setEstadoPedido] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPedidoDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const pedidoDocRef = doc(db, "pedidos", pedidoId);
        const docSnap = await getDoc(pedidoDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPedido(data);
          setEstadoPedido(data.estado);
        } else {
          setError("Pedido no encontrado.");
        }
      } catch (e) {
        console.error("Error al cargar el detalle del pedido:", e);
        setError("Error al cargar el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalle();
  }, [pedidoId]);

  useEffect(() => {
    if (pedido) {
      setEstadoPedido(pedido.estado);
    }
  }, [pedido]);

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      setLoading(true);
      const pedidoDocRef = doc(db, "pedidos", pedidoId);
      await updateDoc(pedidoDocRef, { estado: nuevoEstado });
      setEstadoPedido(nuevoEstado);
      Alert.alert("Estado actualizado", `El estado del pedido ha sido cambiado a: ${nuevoEstado}`); // Usa Alert importado
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      Alert.alert("Error", "No se pudo actualizar el estado del pedido. Intenta nuevamente."); // Usa Alert importado
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemProducto}>
      <Text>{item.nombre} x {item.cantidad}</Text>
      <Text>Total: {item.precioTotal} Tokens</Text>
    </View>
  );

  if (loading) {
    return <Text>Cargando detalles del pedido...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!pedido) {
    return <Text>No se encontró información del pedido.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido: {pedidoId}</Text>
      <Text>Cliente: {pedido.clienteNombre}</Text>
      <Text>Fecha del Pedido: {pedido.fechaPedido?.toDate ? pedido.fechaPedido.toDate().toLocaleString() : new Date(pedido.fechaPedido).toLocaleString()}</Text>
      <Text>Día de Entrega: {pedido.diaEntrega || 'No especificado'}</Text>
      <Text>Hora de Entrega: {pedido.horaEntrega || 'No especificado'}</Text>
      <Text style={styles.subtitle}>Productos:</Text>
      <FlatList
        data={pedido.resumenPedido}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.total}>Costo Total: {pedido.costoTotal} Tokens</Text>

      <Text style={styles.subtitle}>Cambiar Estado:</Text>
      <View style={styles.estadosContainer}>
        <TouchableOpacity
          style={[styles.estadoBoton, estadoPedido === 'Pendiente' && styles.estadoSeleccionado]}
          onPress={() => handleCambiarEstado('Pendiente')}
          disabled={loading}
        >
          <Text>Pendiente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.estadoBoton, estadoPedido === 'Listo para recoger' && styles.estadoSeleccionado]}
          onPress={() => handleCambiarEstado('Listo para recoger')}
          disabled={loading}
        >
          <Text>Listo para recoger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.estadoBoton, estadoPedido === 'Entregado' && styles.estadoSeleccionado]}
          onPress={() => handleCambiarEstado('Entregado')}
          disabled={loading}
        >
          <Text>Entregado</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.estadoBoton, estadoPedido === 'Cancelado' && styles.estadoSeleccionado]}
          onPress={() => handleCambiarEstado('Cancelado')}
          disabled={loading}
        >
          <Text>Cancelado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#555",
  },
  itemProducto: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
    color: "#007bff",
  },
  estadosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
    paddingHorizontal: 10,  
  },
  estadoBoton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 8,
    fontSize: 12,
  },
  estadoSeleccionado: {
    backgroundColor: "#a0a0a0",
  },
});