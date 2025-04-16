import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

export default function AdminRestauranteView() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const agregarProducto = () => {
    if (nombre.trim() === "") return;
    setProductos([...productos, nombre]);
    setNombre("");
  };

  const editarProducto = (index) => {
    setNombre(productos[index]);
    setEditIndex(index);
  };

  const guardarCambios = () => {
    if (editIndex !== null) {
      const nuevosProductos = [...productos];
      nuevosProductos[editIndex] = nombre;
      setProductos(nuevosProductos);
      setEditIndex(null);
      setNombre("");
    }
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adm Restaurante</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Nombre del producto"
          placeholderTextColor="#aaa"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={editIndex !== null ? guardarCambios : agregarProducto}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {editIndex !== null ? "Guardar Cambios" : "Agregar Producto"}
          </Text>
        </TouchableOpacity>
      </View>

      {productos.map((producto, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.productText}>{producto}</Text>

          <TouchableOpacity onPress={() => editarProducto(index)} style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => eliminarProducto(index)}
            style={[styles.button, styles.deleteButton]}
          >
            <Text style={styles.buttonText}>Eliminar Producto</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    color: "#00BFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#001f3f",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0074D9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF4136",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
});
