import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native';
import { db, auth } from '../../config/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser, signOut } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SuperAdminView() {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('rol', '==', 'admin'));
      const querySnapshot = await getDocs(q);

      const adminsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        correo: doc.data().correo,
        role: doc.data().rol,
        NombreRestaurante: doc.data().NombreRestaurante || '',
        isEditing: false,
        newEmail: doc.data().correo || '',
        newRestaurantName: doc.data().NombreRestaurante || '',
        uid: doc.data().uid, // Asumiendo que el uid del auth se guarda en el documento
      }));

      setAdmins(adminsList);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los administradores.');
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword || !newRestaurantName) {
      Alert.alert('Campos incompletos', 'Completa todos los campos para crear un administrador.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newAdminEmail, newAdminPassword);
      const uid = userCredential.user.uid;

      await addDoc(collection(db, 'usuarios'), {
        uid,
        correo: newAdminEmail,
        NombreRestaurante: newRestaurantName,
        rol: 'admin',
        tokens: 0,
      });

      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewRestaurantName('');
      setIsAddingAdmin(false);
      fetchAdmins();
      Alert.alert('Éxito', 'Administrador agregado correctamente.');
    } catch (error) {
      Alert.alert('Error al crear el usuario', error.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas eliminar este administrador? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const adminRef = doc(db, 'usuarios', adminId);
              await deleteDoc(adminRef);
              // Aquí podrías implementar la lógica para eliminar el usuario de auth si es necesario
              fetchAdmins();
              Alert.alert('Eliminado', 'Administrador eliminado correctamente.');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el administrador.');
            }
          },
        },
      ]
    );
  };

  const handleEditAdmin = (admin) => {
    const updatedAdmins = admins.map(a =>
      a.id === admin.id ? { ...a, isEditing: true } : a
    );
    setAdmins(updatedAdmins);
  };

  const handleCancelEdit = (admin) => {
    const updatedAdmins = admins.map(a =>
      a.id === admin.id ? { ...a, isEditing: false } : a
    );
    setAdmins(updatedAdmins);
  };

  const handleSaveEdit = async (admin) => {
    if (!admin.newEmail || !admin.newEmail.trim() || !admin.newRestaurantName || !admin.newRestaurantName.trim()) {
      Alert.alert('Advertencia', 'Por favor, completa todos los campos para guardar.');
      return;
    }
    try {
      const adminRef = doc(db, 'usuarios', admin.id);
      await updateDoc(adminRef, {
        correo: admin.newEmail,
        NombreRestaurante: admin.newRestaurantName,
      });

      const updatedAdmins = admins.map(a =>
        a.id === admin.id ? { ...a, isEditing: false, correo: a.newEmail, NombreRestaurante: a.newRestaurantName } : a
      );
      setAdmins(updatedAdmins);
      Alert.alert('Éxito', 'Administrador actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar al administrador.');
    }
  };

  const handleInputChange = (id, text, field) => {
    const updatedAdmins = admins.map(admin =>
      admin.id === id ? { ...admin, [field]: text } : admin
    );
    setAdmins(updatedAdmins);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  const renderAdminItem = (admin) => (
    <View key={admin.id} style={styles.listItem}>
      {admin.isEditing ? (
        <>
          <TextInput
            style={styles.editInput}
            value={admin.newEmail}
            onChangeText={(text) => handleInputChange(admin.id, text, 'newEmail')}
            placeholder="Nuevo correo electrónico"
          />
          <TextInput
            style={styles.editInput}
            value={admin.newRestaurantName}
            onChangeText={(text) => handleInputChange(admin.id, text, 'newRestaurantName')}
            placeholder="Nuevo nombre de restaurante"
          />
        </>
      ) : (
        <>
          <Text style={styles.emailText}>{admin.correo}</Text>
          <Text style={styles.restaurantText}>{admin.NombreRestaurante}</Text>
        </>
      )}
      <View style={styles.actions}>
        {!admin.isEditing ? (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleEditAdmin(admin)}>
              <FontAwesome name="edit" size={20} color="#00BFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteAdmin(admin.id)}>
              <FontAwesome name="trash" size={20} color="#FF4136" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleSaveEdit(admin)}>
              <FontAwesome name="save" size={20} color="#28a745" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleCancelEdit(admin)}>
              <FontAwesome name="times" size={20} color="#dc3545" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Espacio super-usuario</Text>

      {isAddingAdmin ? (
        <View style={styles.addCard}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#aaa"
            value={newAdminEmail}
            onChangeText={setNewAdminEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            value={newAdminPassword}
            onChangeText={setNewAdminPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Nombre del restaurante"
            placeholderTextColor="#aaa"
            value={newRestaurantName}
            onChangeText={setNewRestaurantName}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
            <Text style={styles.addButtonText}>Añadir administrador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddingAdmin(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addAdminButton} onPress={() => setIsAddingAdmin(true)}>
          <Text style={styles.addAdminButtonText}>Añadir nuevo usuario</Text>
        </TouchableOpacity>
      )}

      <View style={styles.listContainer}>
        {admins.map(renderAdminItem)}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0", padding: 20 },
  title: { fontSize: 24, color: "#333", fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  addCard: { backgroundColor: "#fff", padding: 20, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  input: { height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 12, paddingLeft: 10, borderRadius: 4 },
  addButton: { backgroundColor: "#00BFFF", padding: 10, borderRadius: 4, alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 16 },
  cancelButton: { backgroundColor: "#dc3545", padding: 10, borderRadius: 4, alignItems: "center", marginTop: 10 },
  cancelButtonText: { color: "#fff", fontSize: 16 },
  addAdminButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 4, alignItems: "center", marginVertical: 20 },
  addAdminButtonText: { color: "#fff", fontSize: 16 },
  listContainer: { marginBottom: 40 },
  listItem: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  emailText: { fontSize: 16, color: "#333" },
  restaurantText: { fontSize: 14, color: "#666", marginTop: 5 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionButton: { padding: 5 },
  editInput: { height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 12, paddingLeft: 10, borderRadius: 4 },
  logoutButton: { backgroundColor: "#FF4136", padding: 12, borderRadius: 4, alignItems: "center", marginTop: 20 },
  logoutButtonText: { color: "#fff", fontSize: 16 },
});