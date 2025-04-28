import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Cambiado a useRouter de expo-router

export default function AdminRestauranteView() {
  // Usamos el router de Expo
  const router = useRouter();
  
  // El nombre del restaurante podría venir de una prop o estado
  const nombreRestaurante = "D'Café";

  const handleAñadir = () => {
    // Implementar lógica para añadir
    console.log("Añadir nuevo elemento");
  };

  const handleEditar = () => {
    // Implementar lógica para editar
    console.log("Editar elemento");
  };

  const handleBorrar = () => {
    // Implementar lógica para borrar
    console.log("Borrar elemento");
  };

  const handleVisualizarMenu = () => {
    // Aquí se podría navegar a la vista de visualización del menú cuando esté implementada
    console.log("Visualizar menú");
    // Por ejemplo: router.push("/menu/VisualizarMenu");
  };

  const handleVolverLogin = () => {
    // Navegar de regreso a la pantalla de login usando Expo Router
    try {
      // Usar la misma ruta que se usa en el Login para navegar
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error navegando a Login:", error);
      // Alternativa
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurantes USC</Text>
      
      <Text style={styles.welcomeText}>¡ Bienvenido {nombreRestaurante} !</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAñadir} style={styles.button}>
          <Text style={styles.buttonText}>AÑADIR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleEditar} style={styles.button}>
          <Text style={styles.buttonText}>EDITAR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleBorrar} style={styles.button}>
          <Text style={styles.buttonText}>BORRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleVisualizarMenu} style={styles.button}>
          <Text style={styles.buttonText}>VISUALIZAR MENÚ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleVolverLogin} style={[styles.button, styles.loginButton]}>
          <Text style={styles.buttonText}>VOLVER AL LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 40,
    marginTop: 20,
  },
  buttonContainer: {
    gap: 16, // Espacio entre botones
  },
  button: {
    backgroundColor: "#3f51b5", // Color azul similar al de la imagen
    padding: 14,
    borderRadius: 4,
    alignItems: "center",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#FF0000", // Color rojo para el botón de volver al login
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  }
});
