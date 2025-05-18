import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export default function BorrandoProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const productoDocRef = doc(db, 'productos', id);
          const docSnap = await getDoc(productoDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNombre(data.nombre || "");
            setDescripcion(data.descripcion || "");
            setPrecio(String(data.precio) || "");
          } else {
            setError("Producto no encontrado.");
          }
        } else {
          setError("ID del producto no proporcionado.");
        }
      } catch (e) {
        console.error("Error al cargar el producto:", e);
        setError("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  const borrarProducto = async () => {
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        const productoDocRef = doc(db, 'productos', id);
        await deleteDoc(productoDocRef);
        setSuccess("Producto borrado correctamente.");
        // Opcional: Volver a la lista de productos después de borrar
        router.back();
      } else {
        setError("ID del producto no proporcionado.");
      }
    } catch (error) {
      console.error("Error al borrar el producto:", error);
      setError("Error al borrar el producto. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return <Text>Cargando información del producto...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrar Producto</Text>
      <Text style={styles.confirmationText}>¿Estás seguro de que quieres borrar el siguiente producto?</Text>
      <Text style={styles.productName}>{nombre}</Text>
      <Text style={styles.productDescription}>{descripcion}</Text>
      <Text style={styles.productPrice}>{precio} Tokens</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <TouchableOpacity style={styles.deleteButton} onPress={borrarProducto}>
        <Text style={styles.deleteButtonText}>BORRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
});