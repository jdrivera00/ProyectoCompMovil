import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // ajusta la ruta según dónde esté este archivo

export const getUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.rol || null;
    } else {
      console.warn("No se encontró el usuario con UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo rol del usuario:", error);
    throw error;
  }
};
