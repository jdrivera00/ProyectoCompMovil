// app/(cliente)/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, auth } from '../../config/firebaseConfig'; // Importa db y auth
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export default function Carrito() {
  const { cartItems: cartItemsString, restauranteId } = useLocalSearchParams();
  const router = useRouter();
  const [clienteUid, setClienteUid] = useState(null);
  const [clienteNombre, setClienteNombre] = useState(null);

  // Convertir la cadena JSON de vuelta a un array de objetos
  const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

  const [diaEntrega, setDiaEntrega] = useState('');
  const [horaEntrega, setHoraEntrega] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setClienteUid(user.uid);
        // Obtener el nombre del cliente desde la colección 'usuarios'
        const clienteDocRef = doc(db, 'usuarios', user.uid);
        const clienteDocSnap = await getDoc(clienteDocRef);
        if (clienteDocSnap.exists() && clienteDocSnap.data().nombre) {
          setClienteNombre(clienteDocSnap.data().nombre);
        } else {
          console.log('No se encontró el nombre del cliente en la base de datos.');
        }
      } else {
        console.log('Usuario no autenticado');
        router.replace('/(auth)/login');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const calcularTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio || 0) * (item.quantity || 1), 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCarrito}>
      <Text style={styles.nombreItem}>{item.nombre} ({item.quantity || 1})</Text>
      <Text style={styles.precioItem}>{item.precio} x {item.quantity || 1} = {item.precio * (item.quantity || 1)} Tokens</Text>
    </View>
  );

  const handleFinalizarPedido = async () => {
    if (!clienteUid || !clienteNombre) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario. Por favor, intenta nuevamente.');
      return;
    }

    if (!restauranteId) {
      Alert.alert('Error', 'No se pudo obtener la información del restaurante. Por favor, intenta nuevamente.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Por favor, añade productos al carrito antes de finalizar el pedido.');
      return;
    }

    try {
      const pedidosRef = collection(db, 'pedidos');
      await addDoc(pedidosRef, {
        clienteUid: clienteUid,
        clienteNombre: clienteNombre, // Agregamos el nombre del cliente
        restauranteUid: restauranteId,
        diaEntrega: diaEntrega,
        horaEntrega: horaEntrega,
        resumenPedido: cartItems.map(item => ({
          nombre: item.nombre,
          cantidad: item.quantity,
          precioUnitario: item.precio,
          precioTotal: item.precio * item.quantity,
        })),
        costoTotal: calcularTotal(),
        estado: 'Pendiente',
        fechaPedido: new Date(),
      });

      Alert.alert('Pedido realizado', 'Tu pedido ha sido registrado exitosamente.');
      router.push('/(cliente)/ClienteHome');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      Alert.alert('Error', 'Hubo un problema al registrar tu pedido. Por favor, intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Finaliza tu pedido</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Día de entrega (DD/MM/AAAA):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 19/05/2025"
          value={diaEntrega}
          onChangeText={setDiaEntrega}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de entrega (HH:MM - formato 24h):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 18:00"
          value={horaEntrega}
          onChangeText={setHoraEntrega}
        />
      </View>

      <Text style={styles.resumenTitulo}>Resumen del pedido:</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.cartItemId}
          renderItem={renderItem}
        />
      ) : (
        <Text>El carrito está vacío.</Text>
      )}

      <Text style={styles.costoTotal}>Costo Total: {calcularTotal()} Tokens</Text>

      <TouchableOpacity style={styles.botonFinalizar} onPress={handleFinalizarPedido}>
        <Text style={styles.textoBotonFinalizar}>Finalizar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  resumenTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemCarrito: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombreItem: {
    fontSize: 16,
    flex: 2,
  },
  precioItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    flex: 1,
    textAlign: 'right',
  },
  costoTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'right',
  },
  botonFinalizar: {
    backgroundColor: '#3F51B5',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  textoBotonFinalizar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});