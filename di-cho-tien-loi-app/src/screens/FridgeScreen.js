import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import client from '../api/client';
import { useFocusEffect } from '@react-navigation/native';

const FridgeScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State cho Modal thêm đồ
  const [modalVisible, setModalVisible] = useState(false);
  const [foods, setFoods] = useState([]); // Danh sách thực phẩm để chọn
  const [searchQuery, setSearchQuery] = useState(''); // Tìm kiếm món ăn
  
  // Form dữ liệu
  const [selectedFood, setSelectedFood] = useState(null); // Món đã chọn
  const [newFoodName, setNewFoodName] = useState(''); // Tên món mới (nếu không chọn)
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [days, setDays] = useState('7'); // Hạn sử dụng (mặc định 7 ngày)

  useFocusEffect(
    React.useCallback(() => {
      fetchFridgeItems();
      fetchFoods(); // Tải sẵn danh sách thực phẩm
    }, [])
  );

  const fetchFridgeItems = async () => {
    try {
      const res = await client.get('/it4788/fridge');
      if (res.data.code === '00228') setItems(res.data.data);
    } catch (e) { console.log("Lỗi tải tủ lạnh:", e); }
  };

  const fetchFoods = async () => {
    try {
      const res = await client.get('/it4788/food');
      if (res.data.code === '00188') setFoods(res.data.data);
    } catch (e) { console.log("Lỗi tải thực phẩm:", e); }
  };

  const handleAddItem = async () => {
    if (!selectedFood && !newFoodName) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn món ăn hoặc nhập tên món mới.");
      return;
    }

    setLoading(true);
    try {
      let foodId = selectedFood ? selectedFood._id : null;

      // 1. Nếu là món mới -> Gọi API tạo Food trước
      if (!foodId) {
        // Mặc định cho vào nhóm 'Khác' nếu user lười chọn category
        const createRes = await client.post('/it4788/food', {
          name: newFoodName,
          category: 'Khác', 
          unit: 'Gói'
        });
        if (createRes.data.code === '00160') {
          foodId = createRes.data.data._id;
          fetchFoods(); // Tải lại list food cho lần sau
        } else {
          throw new Error("Không tạo được món ăn mới");
        }
      }

      // 2. Tính ngày hết hạn
      const useWithinDate = new Date();
      useWithinDate.setDate(useWithinDate.getDate() + parseInt(days));

      // 3. Thêm vào tủ lạnh
      await client.post('/it4788/fridge', {
        foodId: foodId,
        quantity: parseInt(quantity),
        note: note,
        useWithin: useWithinDate
      });

      Alert.alert("Thành công", "Đã cất đồ vào tủ lạnh!");
      setModalVisible(false);
      resetForm();
      fetchFridgeItems();

    } catch (e) {
      Alert.alert("Lỗi", "Không thêm được: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFood(null);
    setNewFoodName('');
    setQuantity('1');
    setNote('');
    setDays('7');
    setSearchQuery('');
  };

  const deleteItem = (id) => {
    Alert.alert("Xóa", "Bạn đã dùng hết món này?", [
        { text: "Chưa", style: "cancel" },
        { text: "Rồi (Xóa)", onPress: async () => {
            await client.delete(`/it4788/fridge/${id}`);
            fetchFridgeItems();
        }}
    ]);
  };

  // Lọc danh sách food theo từ khóa tìm kiếm
  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❄️ Tủ Lạnh ({items.length} món)</Text>
      
      <FlatList
        data={items}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flex: 1}}>
                <Text style={styles.foodName}>{item.food?.name || 'Đồ ăn'}</Text>
                <Text style={{color:'#555'}}>SL: {item.quantity} | {item.note}</Text>
                {item.useWithin && (
                    <Text style={{color: new Date(item.useWithin) < new Date() ? 'red' : 'green', fontSize:12, fontWeight:'bold'}}>
                        {new Date(item.useWithin) < new Date() ? 'ĐÃ HẾT HẠN: ' : 'HSD: '}
                        {new Date(item.useWithin).toLocaleDateString()}
                    </Text>
                )}
            </View>
            <TouchableOpacity onPress={() => deleteItem(item._id)} style={styles.delBtn}>
                <Text style={{fontSize: 20}}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:50, color:'gray'}}>Tủ lạnh trống trơn.
Bấm dấu + để đi chợ về nào!</Text>}
      />

      {/* Nút FAB Thêm đồ */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{fontSize:30, color:'white'}}>+</Text>
      </TouchableOpacity>

      {/* MODAL NHẬP LIỆU */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📥 Cất đồ vào tủ</Text>
            
            <ScrollView style={{maxHeight: 400}}>
                {/* 1. Chọn món ăn */}
                <Text style={styles.label}>Tên món ăn:</Text>
                {selectedFood ? (
                    <View style={styles.selectedBadge}>
                        <Text style={{color:'white', fontWeight:'bold'}}>{selectedFood.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedFood(null)}>
                            <Text style={{color:'white', marginLeft:10}}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <TextInput 
                            style={styles.input} 
                            placeholder="🔍 Tìm hoặc nhập tên món mới..." 
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                setNewFoodName(text); // Tự động lấy text làm tên món mới
                            }}
                        />
                        {/* Gợi ý món ăn */}
                        {searchQuery.length > 0 && filteredFoods.length > 0 && (
                            <View style={styles.suggestionBox}>
                                {filteredFoods.slice(0, 3).map(f => (
                                    <TouchableOpacity key={f._id} style={styles.suggestionItem} onPress={() => {
                                        setSelectedFood(f);
                                        setSearchQuery('');
                                    }}>
                                        <Text>👉 {f.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {searchQuery.length > 0 && filteredFoods.length === 0 && (
                            <Text style={{color:'green', fontSize:12, marginBottom:10}}>✨ Sẽ tạo món mới: "{searchQuery}"</Text>
                        )}
                    </View>
                )}

                {/* 2. Số lượng */}
                <Text style={styles.label}>Số lượng:</Text>
                <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />

                {/* 3. Hạn dùng */}
                <Text style={styles.label}>Dùng trong bao nhiêu ngày?</Text>
                <TextInput style={styles.input} value={days} onChangeText={setDays} keyboardType="numeric" placeholder="VD: 7" />

                {/* 4. Ghi chú */}
                <Text style={styles.label}>Ghi chú (Vị trí, tình trạng...):</Text>
                <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="VD: Ngăn đá, túi xanh..." />
            </ScrollView>

            <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => {
                    setModalVisible(false);
                    resetForm();
                }}>
                    <Text style={{color:'gray'}}>Hủy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleAddItem} disabled={loading}>
                    {loading ? <ActivityIndicator color="white"/> : <Text style={{color:'white', fontWeight:'bold'}}>LƯU VÀO TỦ</Text>}
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e3f2fd' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1565c0' },
  card: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  foodName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  delBtn: { padding: 10, backgroundColor: '#ffebee', borderRadius: 50 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#1565c0', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1565c0' },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: '#f9f9f9' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  btnCancel: { backgroundColor: '#eee' },
  btnSave: { backgroundColor: '#1565c0' },
  
  // Suggestion & Selected
  selectedBadge: { flexDirection: 'row', backgroundColor: '#27ae60', padding: 10, borderRadius: 20, alignSelf: 'flex-start', alignItems: 'center', marginBottom: 10 },
  suggestionBox: { borderWidth: 1, borderColor: '#eee', borderRadius: 5, marginBottom: 10 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }
});

export default FridgeScreen;
