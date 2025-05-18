// app/(auth)/_layout.jsx
import 'react-native-get-random-values';
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
