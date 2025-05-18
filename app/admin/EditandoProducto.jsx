import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditandoProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
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
            setImagen(data.imagen || "");
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

  const editarProducto = async () => {
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        const productoDocRef = doc(db, 'productos', id);
        await updateDoc(productoDocRef, {
          nombre: nombre,
          imagen: imagen,
          descripcion: descripcion,
          precio: Number(precio),
        });
        setSuccess("Producto actualizado correctamente.");
        // Opcional: Volver a la vista de lista de productos
        router.back();
      } else {
        setError("ID del producto no proporcionado.");
      }
    } catch (error) {
      console.error("Error al editar el producto:", error);
      setError("Error al editar el producto. Inténtalo de nuevo.");
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
      <Text style={styles.title}>Editando Producto</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nombre del Producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="URL de la Imagen"
        value={imagen}
        onChangeText={setImagen}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Precio (en tokens)"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={editarProducto}>
        <Text style={styles.buttonText}>EDITAR</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
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