import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AdminRestauranteView() {
  const router = useRouter();
  const [nombreRestaurante, setNombreRestaurante] = useState("Cargando...");

  useEffect(() => {
    const obtenerNombreRestaurante = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usuariosRef = collection(db, 'usuarios');
          const q = query(usuariosRef, where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              if (userData && userData.NombreRestaurante) {
                setNombreRestaurante(userData.NombreRestaurante);
              } else {
                setNombreRestaurante("Nombre no encontrado en el documento");
              }
            });
          } else {
            setNombreRestaurante("Usuario no encontrado en la colección");
          }
        } else {
          setNombreRestaurante("No hay usuario autenticado");
        }
      } catch (error) {
        console.error("Error al obtener el nombre del restaurante:", error);
        setNombreRestaurante("Error al cargar el nombre");
      }
    };

    obtenerNombreRestaurante();
  }, []);

  const handleAñadir = () => {
    router.push("admin/AgregarProductoScreen");
  };

  const handleEditar = () => {
    router.push("/admin/EditarProducto")
  };

  const handleBorrar = () => {
    router.push("/admin/BorrarProducto")
  };

  const handleVisualizarMenu = () => {
    router.push("/admin/VisualizarMenuScreen");
  };

  const handleVerPedidos = () => {
    router.push("/admin/PedidoScreen"); // Navegación a la nueva pantalla
  };

  const handleVolverLogin = () => {
    try {
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error navegando a Login:", error);
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administración de Restaurante</Text>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>¡Bienvenido {nombreRestaurante}!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAñadir} style={styles.button}>
          <Text style={styles.buttonText}>AÑADIR PRODUCTO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditar} style={styles.button}>
          <Text style={styles.buttonText}>EDITAR PRODUCTO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBorrar} style={styles.button}>
          <Text style={styles.buttonText}>BORRAR PRODUCTO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleVisualizarMenu} style={styles.button}>
          <Text style={styles.buttonText}>VISUALIZAR MENÚ</Text>
        </TouchableOpacity>

        {/* Nuevo botón para ver los pedidos */}
        <TouchableOpacity onPress={handleVerPedidos} style={styles.button}>
          <Text style={styles.buttonText}>VER PEDIDOS</Text>
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
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  welcomeContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: "center",
    color: "#555",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: "#dc3545",
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});