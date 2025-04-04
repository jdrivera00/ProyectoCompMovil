import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD1GTu2oVMWyem7zdAvdyi9S68dH4F3RzE",
    authDomain: "apprestaurantes-a4d4e.firebaseapp.com",
    projectId: "apprestaurantes-a4d4e",
    storageBucket: "apprestaurantes-a4d4e.firebasestorage.app",
    messagingSenderId: "54839098152",
    appId: "1:54839098152:web:4f443945f5d034c60eae1d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
