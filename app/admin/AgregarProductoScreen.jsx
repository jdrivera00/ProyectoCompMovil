import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebaseConfig"; // Asegúrate de que la ruta sea correcta
import { collection, addDoc } from 'firebase/firestore';

export default function AñadirProductoScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const guardarProducto = async () => {
    setError(null);
    setSuccess(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Usuario no autenticado.");
        return;
      }

      const productosCollectionRef = collection(db, 'productos');
      await addDoc(productosCollectionRef, {
        restauranteId: user.uid,
        nombre: nombre,
        imagen: imagen,
        descripcion: descripcion,
        precio: Number(precio), // Asegurarse de que el precio sea un número
        activo: true, // Por defecto, el producto estará activo
        // Puedes añadir más campos si es necesario
      });

      setSuccess("Producto añadido correctamente.");
      // Limpiar el formulario después de guardar
      setNombre("");
      setImagen("");
      setDescripcion("");
      setPrecio("");
    } catch (error) {
      console.error("Error al añadir producto:", error);
      setError("Error al añadir el producto. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Nuevo Producto</Text>

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

      <TouchableOpacity style={styles.button} onPress={guardarProducto}>
        <Text style={styles.buttonText}>Guardar Producto</Text>
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