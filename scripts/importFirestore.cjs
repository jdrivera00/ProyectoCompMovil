const admin = require("firebase-admin");
const fs = require("fs");

// Importa las credenciales
const serviceAccount = require("../serviceAccountKey.json");

// Inicializa Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Leer archivo JSON
const data = JSON.parse(fs.readFileSync("./data/firestoreSeed.json", "utf8"));

// Función principal
async function importData() {
  try {
    for (const collection in data) {
      const documents = data[collection];
      for (const doc of documents) {
        const docId = doc.id || doc.uid || undefined;
        const ref = docId
          ? db.collection(collection).doc(docId)
          : db.collection(collection).doc(); // genera ID automático si no hay ID

        await ref.set(doc);
        console.log(`✔️ Insertado en colección "${collection}":`, docId || ref.id);
      }
    }
    console.log("✅ Importación completada con éxito.");
  } catch (error) {
    console.error("❌ Error al importar datos:", error);
  }
}

importData();
