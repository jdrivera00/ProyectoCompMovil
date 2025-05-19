// app/cliente/RecargarTokensScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function RecargarTokensScreen() {
  const { clienteUid } = useLocalSearchParams();
  const router = useRouter();
  const [saldoActual, setSaldoActual] = useState(0);
  const [cantidadRecargar, setCantidadRecargar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaldo = async () => {
      setLoading(true);
      setError(null);
      try {
        const clienteDocRef = doc(db, 'usuarios', clienteUid);
        const clienteDocSnap = await getDoc(clienteDocRef);
        if (clienteDocSnap.exists()) {
          setSaldoActual(clienteDocSnap.data().tokens || 0);
        } else {
          setError('No se encontró la información del usuario.');
        }
      } catch (e) {
        console.error('Error al obtener el saldo:', e);
        setError('Error al obtener el saldo.');
      } finally {
        setLoading(false);
      }
    };

    if (clienteUid) {
      fetchSaldo();
    }
  }, [clienteUid]);

  const handleRecargarTokens = async () => {
    if (!cantidadRecargar || isNaN(cantidadRecargar) || parseInt(cantidadRecargar) <= 0) {
      Alert.alert('Error', 'Por favor, ingresa una cantidad válida para recargar.');
      return;
    }

    const cantidad = parseInt(cantidadRecargar);
    setLoading(true);
    try {
      const clienteDocRef = doc(db, 'usuarios', clienteUid);
      const nuevoSaldo = saldoActual + cantidad;
      await updateDoc(clienteDocRef, { tokens: nuevoSaldo });
      Alert.alert('Recarga Exitosa', `Se han añadido ${cantidad} tokens a tu saldo. Nuevo saldo: ${nuevoSaldo}`);
      router.push('/cliente/PerfilScreen'); // Navegar de vuelta al perfil
    } catch (e) {
      console.error('Error al recargar tokens:', e);
      Alert.alert('Error', 'Hubo un problema al recargar los tokens. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Cargando saldo...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recargar Tokens</Text>
      <Text style={styles.saldoActual}>Saldo Actual: {saldoActual} Tokens</Text>

      <TextInput
        style={styles.input}
        placeholder="Cantidad a recargar"
        keyboardType="numeric"
        value={cantidadRecargar}
        onChangeText={setCantidadRecargar}
      />

      <TouchableOpacity style={styles.button} onPress={handleRecargarTokens} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Recargando...' : 'Recargar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  saldoActual: {
    fontSize: 18,
    marginBottom: 30,
    color: '#555',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});