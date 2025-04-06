import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1GTu2oVMWyem7zdAvdyi9S68dH4F3RzE",
  authDomain: "apprestaurantes-a4d4e.firebaseapp.com",
  projectId: "apprestaurantes-a4d4e",
  storageBucket: "apprestaurantes-a4d4e.firebasestorage.app",
  messagingSenderId: "54839098152",
  appId: "1:54839098152:web:4f443945f5d034c60eae1d"
};

const app = initializeApp(firebaseConfig);

// ✅ Persistencia del login entre sesiones
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
