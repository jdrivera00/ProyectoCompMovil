import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      // Autenticación con Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Consultar Firestore para verificar el rol
      const q = query(collection(db, "usuarios"), where("correo", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Verificar el rol del usuario
        if (userData.rol === "admin") {
          router.replace("/admin/AdminRestauranteView");
        } else if (userData.rol === "cliente") {
          router.replace("/(tabs)/");
        } else {
          Alert.alert("Error", "Rol de usuario no reconocido.");
        }
      } else {
        Alert.alert("Error", "Usuario no encontrado en la base de datos.");
      }
    } catch (error) {
      Alert.alert("Error de autenticación", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingBottom: 40,
          backgroundColor: "#fff",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={require("../../assets/images/LogofullApp.png")}
          style={{
            width: 500,
            height: 420,
            marginBottom: 30,
            alignSelf: "center",
          }}
          resizeMode="contain"
        />

        {/* Título */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#000",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Restaurantes USC
        </Text>

        {/* Inputs */}
        <View style={{ width: "90%", maxWidth: 400 }}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            style={{
              width: "100%",
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 12,
            }}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            style={{
              width: "100%",
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 24,
            }}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Botón login */}
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: "#053b83",
            paddingVertical: 12,
            borderRadius: 12,
            width: "90%",
            maxWidth: 400,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        {/* Enlace a registro */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={{
            marginTop: 16,
            alignItems: "center",
            width: "90%",
            maxWidth: 400,
          }}
        >
          <Text style={{ textAlign: "center" }}>
            ¿Eres estudiante y no estás registrado?
          </Text>
          <Text style={{ color: "#053b83", textAlign: "center" }}>
            Regístrate aquí
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
