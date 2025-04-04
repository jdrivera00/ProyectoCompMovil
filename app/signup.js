import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Cuenta creada con éxito");
            router.push("/home");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View>
            <Text>Registrarse</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Registrarse" onPress={handleSignUp} />
        </View>
    );
}
