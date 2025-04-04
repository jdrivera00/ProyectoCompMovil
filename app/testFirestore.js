import { db } from '../config/firebaseConfig.js';
import { collection, addDoc } from "firebase/firestore";

const agregarUsuario = async () => {
  try {
    const docRef = await addDoc(collection(db, "usuarios"), {
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      tokens: 50
    });
    console.log("Documento agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al agregar documento: ", e);
  }
};

agregarUsuario();
