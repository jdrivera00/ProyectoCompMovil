// app/(cliente)/EditarPerfilScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState(""); // No se recomienda editar la contraseña directamente aquí

  const [tipos] = useState([
    "Cédula de ciudadanía",
    "Tarjeta de identidad",
    "Cédula de extranjería",
    "Pasaporte",
  ]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setNombre(userData.nombre || "");
          setApellido(userData.apellido || "");
          setTipoDocumento(userData.tipoDocumento || "");
          setNumeroDocumento(userData.numeroDocumento || "");
          setCelular(userData.celular || "");
          setCorreo(userData.correo || "");
        } else {
          Alert.alert("Error", "No se encontró la información del usuario.");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
        console.error("Error fetching user data:", error);
      }
    }
  };

  const handleGuardarCambios = async () => {
    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        await updateDoc(doc(db, "usuarios", user.uid), {
          nombre,
          apellido,
          tipoDocumento,
          numeroDocumento,
          celular,
          correo,
          // No incluimos la contraseña aquí para evitar actualizaciones accidentales
        });
        Alert.alert("Perfil Actualizado", "Tu información ha sido actualizada con éxito.", [
          { text: "Aceptar", onPress: () => router.push("/cliente/PerfilScreen") },
        ]);
      } catch (error) {
        Alert.alert("Error", "No se pudieron guardar los cambios.");
        console.error("Error updating user data:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Editar Perfil
        </Text>

        {/* Nombre y Apellido */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <TextInput
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              marginRight: 6,
            }}
          />
          <TextInput
            placeholder="Tu apellido"
            value={apellido}
            onChangeText={setApellido}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              marginLeft: 6,
            }}
          />
        </View>

        {/* Tipo de documento */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#000" }}>{tipoDocumento || "Selecciona tu tipo de documento"}</Text>
        </TouchableOpacity>

        {/* Modal con opciones de documento */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              padding: 20,
            }}
            onPress={() => setModalVisible(false)}
          >
            <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 16 }}>
              {tipos.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  onPress={() => {
                    setTipoDocumento(tipo);
                    setModalVisible(false);
                  }}
                  style={{ paddingVertical: 12 }}
                >
                  <Text>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* Campos restantes */}
        <TextInput
          placeholder="Número de identidad"
          value={numeroDocumento}
          onChangeText={setNumeroDocumento}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="Celular"
          value={celular}
          onChangeText={setCelular}
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="Correo Institucional"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 24,
          }}
        />

        {/* Botón de guardar cambios */}
        <TouchableOpacity
          onPress={handleGuardarCambios}
          style={{
            backgroundColor: "#2e43a1",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
