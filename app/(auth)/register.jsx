import { useState } from "react";
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
  Animated
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("Cédula de ciudadanía");
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleRegister = async () => {
    if (
      !nombre ||
      !apellido ||
      !tipoDocumento ||
      !numeroDocumento ||
      !celular ||
      !correo ||
      !contrasena
    ) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        apellido,
        tipoDocumento,
        numeroDocumento,
        celular,
        correo,
        rol: "cliente",
      });

      Alert.alert("Registro exitoso.", "Cuenta creada con éxito.", [
        {
          text: "Aceptar",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const tipos = [
    "Cédula de ciudadanía",
    "Tarjeta de identidad",
    "Cédula de extranjería",
    "Pasaporte"
  ];

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
          Restaurantes USC
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
          <Text style={{ color: "#000" }}>{tipoDocumento}</Text>
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
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 24,
          }}
        />

        {/* Botón de registro */}
        <TouchableOpacity
          onPress={handleRegister}
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
          <Text style={{ color: "white", fontWeight: "bold" }}>Registrarme</Text>
        </TouchableOpacity>

        {/* Botón interactivo para volver al login */}
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            {
              marginTop: 20,
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: pressed ? "#e6e6e6" : "#f5f5f5",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            },
          ]}
        >
          <Text style={{ color: "#053b83", fontWeight: "600" }}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
