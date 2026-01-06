import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Platform } from 'react-native';
import client from '../api/client';

const RecipeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [editingId, setEditingId] = useState(null); // ID món đang sửa
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [ingred, setIngred] = useState('');
  const [step, setStep] = useState('');

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      const res = await client.get('/it4788/recipe');
      if (res.data.code === '00378') setRecipes(res.data.data);
    } catch (e) { }
  }

  const saveRecipe = async () => {
    try {
      if (editingId) {
        await client.put(`/it4788/recipe/${editingId}`, {
          name, description: desc, ingredients: ingred, instruction: step
        });
      } else {
        await client.post('/it4788/recipe', {
          name, description: desc, ingredients: ingred, instruction: step
        });
      }
      setModalVisible(false);
      setEditingId(null);
      clearForm();
      fetchRecipes();
    } catch (e) { Alert.alert("Lỗi", "Thất bại"); }
  }

  const deleteRecipe = async (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
        try {
          await client.delete(`/it4788/recipe/${id}`);
          fetchRecipes();
        } catch (e) { console.log(e); }
      }
      return;
    }

    Alert.alert("Xóa", "Bạn có chắc muốn xóa công thức này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa", style: 'destructive', onPress: async () => {
          try {
            await client.delete(`/it4788/recipe/${id}`);
            fetchRecipes();
          } catch (e) { Alert.alert("Lỗi", "Không xóa được"); }
        }
      }
    ]);
  }

  const openEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setDesc(item.description);
    setIngred(item.ingredients);
    setStep(item.instruction);
    setModalVisible(true);
  }

  const clearForm = () => {
    setName(''); setDesc(''); setIngred(''); setStep('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📖 Công Thức Nấu Ăn</Text>

      <FlatList
        data={recipes}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => openEdit(item)} style={{ marginRight: 15 }}>
                  <Text style={{ color: 'blue', fontWeight: 'bold' }}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecipe(item._id)}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{ fontStyle: 'italic', marginBottom: 5 }}>{item.description}</Text>
            <Text style={{ fontWeight: 'bold' }}>Nguyên liệu:</Text>
            <Text>{item.ingredients}</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Cách làm:</Text>
            <Text>{item.instruction}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => {
        clearForm(); setEditingId(null); setModalVisible(true);
      }}>
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingId ? 'Sửa Công Thức' : 'Thêm Công Thức Mới'}</Text>
          <ScrollView>
            <TextInput style={styles.input} placeholder="Tên món (VD: Thịt kho tàu)" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Mô tả ngắn" value={desc} onChangeText={setDesc} />
            <TextInput style={[styles.input, { height: 60 }]} placeholder="Nguyên liệu (xuống dòng)" multiline value={ingred} onChangeText={setIngred} />
            <TextInput style={[styles.input, { height: 100 }]} placeholder="Cách làm chi tiết..." multiline value={step} onChangeText={setStep} />

            <TouchableOpacity style={styles.saveBtn} onPress={saveRecipe}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{editingId ? 'CẬP NHẬT' : 'LƯU CÔNG THỨC'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalVisible(false); clearForm(); setEditingId(null); }} style={{ marginTop: 20, alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>Hủy</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3e5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#8e24aa' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#8e24aa' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#4a148c' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#8e24aa', justifyContent: 'center', alignItems: 'center' },
  modalContent: { flex: 1, padding: 20, paddingTop: 50 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15, backgroundColor: 'white' },
  saveBtn: { backgroundColor: '#8e24aa', padding: 15, borderRadius: 5, alignItems: 'center' }
});
export default RecipeScreen;
