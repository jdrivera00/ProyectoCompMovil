import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Inicio de sesión exitoso");
            router.push("/home");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View>
            <Text>Iniciar Sesión</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Iniciar sesión" onPress={handleSignIn} />
            <Button title="Registrarse" onPress={() => router.push("/signup")} />
        </View>
    );
}
