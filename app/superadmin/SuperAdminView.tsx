import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native';
import { db, auth } from '../../config/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';

interface Admin {
  id: string;
  correo: string;
  role: string;
  restaurantName: string;
  isEditing?: boolean;
  newEmail: string;
}

export default function SuperAdminView() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const fetchAdmins = async () => {
    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('rol', '==', 'admin'));
      const querySnapshot = await getDocs(q);

      const adminsList: Admin[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        correo: doc.data().correo,
        role: doc.data().rol,
        restaurantName: doc.data().NombreRestaurante || '',
        newEmail: '',
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
      });

      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewRestaurantName('');
      setIsAddingAdmin(false);
      fetchAdmins();
      Alert.alert('Éxito', 'Administrador agregado correctamente.');
    } catch (error: any) {
      Alert.alert('Error al crear el usuario', error.message);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
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
              const adminRef = doc(db, 'usuarios', id);
              await deleteDoc(adminRef);
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

  const handleEditAdmin = (admin: Admin) => {
    const updatedAdmins = admins.map(a =>
      a.id === admin.id ? { ...a, isEditing: true, newEmail: a.correo } : a
    );
    setAdmins(updatedAdmins);
  };

  const handleCancelEdit = (admin: Admin) => {
    const updatedAdmins = admins.map(a =>
      a.id === admin.id ? { ...a, isEditing: false, newEmail: '', restaurantName: '' } : a
    );
    setAdmins(updatedAdmins);
  };

  const handleSaveEdit = async (admin: Admin) => {
    if (!admin.newEmail || !admin.newEmail.trim()) {
      Alert.alert('Advertencia', 'Por favor, ingresa el nuevo correo electrónico.');
      return;
    }
    try {
      const adminRef = doc(db, 'usuarios', admin.id);
      await updateDoc(adminRef, {
        email: admin.newEmail,
        NombreRestaurante: admin.restaurantName,
      });

      const updatedAdmins = admins.map(a =>
        a.id === admin.id
          ? { ...a, isEditing: false, correo: admin.newEmail, restaurantName: admin.restaurantName, newEmail: '' }
          : a
      );
      setAdmins(updatedAdmins);
      Alert.alert('Éxito', 'Administrador actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar al administrador.');
    }
  };

  const handleInputChange = (id: string, text: string, field: 'email' | 'restaurantName') => {
    const updatedAdmins = admins.map(admin =>
      admin.id === id ? { ...admin, [field]: text } : admin
    );
    setAdmins(updatedAdmins);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const renderAdminItem = (admin: Admin) => (
    <View key={admin.id} style={styles.listItem}>
      {admin.isEditing ? (
        <>
          <TextInput
            style={styles.editInput}
            value={admin.newEmail}
            onChangeText={(text) => handleInputChange(admin.id, text, 'email')}
            placeholder="Nuevo correo electrónico"
          />
          <TextInput
            style={styles.editInput}
            value={admin.restaurantName}
            onChangeText={(text) => handleInputChange(admin.id, text, 'restaurantName')}
            placeholder="Nuevo nombre de restaurante"
          />
        </>
      ) : (
        <>
          <Text style={styles.emailText}>{admin.correo}</Text>
          <Text style={styles.restaurantText}>{admin.restaurantName}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0", padding: 20 },
  title: { fontSize: 24, color: "#333", fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  addAdminButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  addAdminButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  listContainer: { backgroundColor: "#fff", borderRadius: 8, padding: 15 },
  listItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  emailText: { fontSize: 16, color: "#333", flex: 1 },
  restaurantText: { fontSize: 16, color: "#333", flex: 1 },
  editInput: { flex: 1, backgroundColor: "#f9f9f9", color: "#333", padding: 8, borderRadius: 5, borderColor: "#ddd", borderWidth: 1, marginRight: 10 },
  actions: { flexDirection: "row" },
  actionButton: { marginLeft: 15 },
  addCard: { backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 20 },
  input: { backgroundColor: "#f9f9f9", color: "#333", padding: 10, borderRadius: 5, marginBottom: 10, borderColor: "#ddd", borderWidth: 1 },
  addButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, alignItems: "center", marginBottom: 5 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#dc3545", padding: 12, borderRadius: 5, alignItems: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "bold" },
});
