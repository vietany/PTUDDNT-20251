import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import client from '../api/client';

const MealScreen = () => {
  const [meals, setMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [foods, setFoods] = useState([]);
  
  // Form
  const [selectedFood, setSelectedFood] = useState(null);
  const [session, setSession] = useState('Sáng'); // Sáng, Trưa, Tối

  useEffect(() => {
    fetchMeals();
    fetchFoods();
  }, []);

  const fetchMeals = async () => {
    try {
        const res = await client.get('/it4788/meal');
        if(res.data.code === '00348') setMeals(res.data.data);
    } catch(e){}
  };

  const fetchFoods = async () => {
      try {
          const res = await client.get('/it4788/food');
          if(res.data.code === '00188') setFoods(res.data.data);
      } catch(e){}
  };

  const addMeal = async () => {
      if(!selectedFood) return;
      try {
          await client.post('/it4788/meal', {
              name: session,
              date: new Date(),
              foodId: selectedFood._id
          });
          setModalVisible(false);
          fetchMeals();
      } catch(e) { Alert.alert("Lỗi", "Không thêm được"); }
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
                <Text style={styles.foodName}>🍲 {item.food?.name}</Text>
                <Text style={{fontSize:12, color:'gray'}}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteMeal(item._id)}>
                <Text style={{color:'red'}}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>Chưa lên lịch ăn gì cả...</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{fontSize:30, color:'white'}}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Thêm Bữa Ăn</Text>
                
                <Text style={{marginBottom:5}}>Chọn buổi:</Text>
                <View style={{flexDirection:'row', marginBottom:15}}>
                    {['Sáng', 'Trưa', 'Tối'].map(s => (
                        <TouchableOpacity key={s} onPress={() => setSession(s)} style={[styles.choiceBtn, session===s && styles.activeBtn]}>
                            <Text style={{color: session===s?'white':'black'}}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={{marginBottom:5}}>Chọn món (Có sẵn trong hệ thống):</Text>
                <FlatList 
                    data={foods}
                    style={{maxHeight: 200, marginBottom: 20}}
                    keyExtractor={item => item._id}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            style={[styles.foodItem, selectedFood?._id === item._id && {backgroundColor:'#dcedc8'}]}
                            onPress={() => setSelectedFood(item)}
                        >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={addMeal}>
                    <Text style={{color:'white', fontWeight:'bold'}}>LƯU LỊCH</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop:15, alignItems:'center'}}>
                    <Text style={{color:'red'}}>Đóng</Text>
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
  card: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  session: { fontWeight: 'bold', color: '#f57f17' },
  foodName: { fontSize: 18 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#fbc02d', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  choiceBtn: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginRight: 10, borderRadius: 5 },
  activeBtn: { backgroundColor: '#fbc02d', borderColor: '#fbc02d' },
  foodItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  saveBtn: { backgroundColor: '#fbc02d', padding: 15, borderRadius: 5, alignItems: 'center' }
});
export default MealScreen;
