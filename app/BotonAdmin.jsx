import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function BotonAdmin() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Reemplazamos la vista actual por la de LoginAdmin
      router.replace("/(auth)/LoginAdmin");
    }, [])
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00BFFF" />
      <Text style={styles.text}>Cargando vista de administrador...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#00BFFF",
    marginTop: 10,
    fontSize: 16,
  },
});

export const screenOptions = {
  title: "Soy administrador",
};
