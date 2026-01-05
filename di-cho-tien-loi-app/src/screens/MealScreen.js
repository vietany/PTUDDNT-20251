import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import client from '../api/client';

const MealScreen = () => {
  const [meals, setMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [foods, setFoods] = useState([]);

  // Form
  const [recipes, setRecipes] = useState([]); // Danh sách công thức

  // Form
  const [session, setSession] = useState('Sáng'); // Sáng, Trưa, Tối
  const [selectedItems, setSelectedItems] = useState([]); // [{type: 'food'|'recipe', id: '...'}]
  const [tab, setTab] = useState('recipe'); // 'recipe' | 'food'

  // Edit State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editSession, setEditSession] = useState('');
  const [editDate, setEditDate] = useState(new Date());

  useEffect(() => {
    fetchMeals();
    fetchFoods();
    fetchRecipes();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await client.get('/it4788/meal');
      if (res.data.code === '00348') setMeals(res.data.data);
    } catch (e) { }
  };

  const fetchFoods = async () => {
    try {
      const res = await client.get('/it4788/food');
      if (res.data.code === '00188') setFoods(res.data.data);
    } catch (e) { }
  };

  const fetchRecipes = async () => {
    try {
      const res = await client.get('/it4788/recipe');
      if (res.data.code === '00378') setRecipes(res.data.data);
    } catch (e) { }
  };

  const addMeal = async () => {
    if (selectedItems.length === 0) return;
    try {
      await client.post('/it4788/meal', {
        name: session,
        date: new Date(),
        items: selectedItems
      });
      setModalVisible(false);
      setSelectedItems([]);
      fetchMeals();
    } catch (e) { Alert.alert("Lỗi", "Không thêm được"); }
  };

  const openEdit = (item) => {
    setEditingMeal(item);
    setEditSession(item.name);
    setEditDate(new Date(item.date));
    setEditModalVisible(true);
  };

  const updateMeal = async () => {
    if (!editingMeal) return;
    try {
      // Chỉ cho sửa buổi và ngày (hiện tại chưa cho đổi món để đơn giản)
      await client.put(`/it4788/meal/${editingMeal._id}`, {
        name: editSession,
        date: editDate
      });
      setEditModalVisible(false);
      setEditingMeal(null);
      fetchMeals();
    } catch (e) { Alert.alert("Lỗi", "Cập nhật thất bại"); }
  };

  const toggleSelection = (item, type) => {
    const exists = selectedItems.find(i => i.id === item._id && i.type === type);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => !(i.id === item._id && i.type === type)));
    } else {
      setSelectedItems([...selectedItems, { type: type, id: item._id }]);
    }
  };

  const deleteMeal = async (id) => {
    await client.delete(`/it4788/meal/${id}`);
    fetchMeals();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Lịch Ăn Hôm Nay</Text>

      <FlatList
        data={meals}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.session}>{item.name}</Text>
              <Text style={styles.foodName}>
                {item.food ? `🍲 ${item.food.name}` : `📖 ${item.recipe ? item.recipe.name : 'Món đã xóa'}`}
              </Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => openEdit(item)} style={{ marginRight: 15 }}>
                <Text style={{ color: 'blue', fontWeight: 'bold' }}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteMeal(item._id)}>
                <Text style={{ color: 'red' }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa lên lịch ăn gì cả...</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Bữa Ăn</Text>

            <Text style={{ marginBottom: 5 }}>Chọn buổi:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
              {['Sáng', 'Trưa', 'Tối'].map(s => (
                <TouchableOpacity key={s} onPress={() => setSession(s)} style={[styles.choiceBtn, session === s && styles.activeBtn]}>
                  <Text style={{ color: session === s ? 'white' : 'black' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TouchableOpacity onPress={() => setTab('recipe')} style={[styles.tabBtn, tab === 'recipe' && styles.activeTab]}>
                <Text style={{ fontWeight: tab === 'recipe' ? 'bold' : 'normal', color: tab === 'recipe' ? '#fbc02d' : 'gray' }}>📖 Công thức</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('food')} style={[styles.tabBtn, tab === 'food' && styles.activeTab]}>
                <Text style={{ fontWeight: tab === 'food' ? 'bold' : 'normal', color: tab === 'food' ? '#fbc02d' : 'gray' }}>❄️ Tủ lạnh</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={tab === 'recipe' ? recipes : foods}
              style={{ maxHeight: 250, marginBottom: 20 }}
              keyExtractor={item => item._id}
              renderItem={({ item }) => {
                const isSelected = selectedItems.some(i => i.id === item._id && i.type === tab);
                return (
                  <TouchableOpacity
                    style={[styles.foodItem, isSelected && { backgroundColor: '#dcedc8' }]}
                    onPress={() => toggleSelection(item, tab)}
                  >
                    <Text>{isSelected ? '✅ ' : '⬜ '}{item.name}</Text>
                  </TouchableOpacity>
                )
              }}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={addMeal}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>LƯU LỊCH</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15, alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal - Chỉ sửa Buổi (Sáng/Trưa/Tối) */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa Bữa Ăn</Text>
            <Text style={{ textAlign: 'center', marginBottom: 15, fontStyle: 'italic' }}>
              {editingMeal?.food?.name || editingMeal?.recipe?.name}
            </Text>

            <Text style={{ marginBottom: 5 }}>Đổi buổi:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'center' }}>
              {['Sáng', 'Trưa', 'Tối'].map(s => (
                <TouchableOpacity key={s} onPress={() => setEditSession(s)} style={[styles.choiceBtn, editSession === s && styles.activeBtn]}>
                  <Text style={{ color: editSession === s ? 'white' : 'black' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={updateMeal}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>CẬP NHẬT</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginTop: 15, alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff8e1' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#fbc02d' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  session: { fontWeight: 'bold', color: '#f57f17' },
  foodName: { fontSize: 18 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#fbc02d', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  choiceBtn: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginRight: 10, borderRadius: 5 },
  activeBtn: { backgroundColor: '#fbc02d', borderColor: '#fbc02d' },
  foodItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  saveBtn: { backgroundColor: '#fbc02d', padding: 15, borderRadius: 5, alignItems: 'center' },
  tabBtn: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#eee' },
  activeTab: { borderBottomColor: '#fbc02d' }
});
export default MealScreen;
