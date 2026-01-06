import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, ScrollView, Platform, StatusBar } from 'react-native';
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
  const [category, setCategory] = useState('Khác'); // Danh mục mặc định
  const [unit, setUnit] = useState('Gói'); // Đơn vị mặc định

  const [selectedCategory, setSelectedCategory] = useState('All'); // Filter danh mục

  const units = ['kg', 'g', 'Lít', 'ml', 'Gói', 'Hộp', 'Chai', 'Lon', 'Quả', 'Củ', 'Bó', 'Con', 'Cái'];

  const categories = [
    { name: 'Thịt', icon: '🥩' },
    { name: 'Rau củ', icon: '🥦' },
    { name: 'Hải sản', icon: '🐟' },
    { name: 'Trái cây', icon: '🍎' },
    { name: 'Đồ uống', icon: '🥤' },
    { name: 'Gia vị', icon: '🧂' },
    { name: 'Khác', icon: '📦' }
  ];

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
        // Sử dụng category người dùng chọn
        const createRes = await client.post('/it4788/food', {
          name: newFoodName,
          category: category,
          unit: unit
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
    setNote('');
    setDays('7');
    setCategory('Khác');
    setUnit('Gói');
    setSearchQuery('');
  };

  const deleteItem = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Bạn đã dùng hết món này?")) {
        client.delete(`/it4788/fridge/${id}`)
          .then(() => fetchFridgeItems())
          .catch(e => console.log("Lỗi xóa:", e));
      }
      return;
    }

    Alert.alert("Xóa", "Bạn đã dùng hết món này?", [
      { text: "Chưa", style: "cancel" },
      {
        text: "Rồi (Xóa)", onPress: async () => {
          await client.delete(`/it4788/fridge/${id}`);
          fetchFridgeItems();
        }
      }
    ]);
  };

  // Lọc danh sách food theo từ khóa tìm kiếm
  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Lọc items theo danh mục đã chọn
  const displayedItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.food?.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❄️ Tủ Lạnh ({items.length} món)</Text>

      {/* Category Filter */}
      <View style={{ height: 60, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.catFilter, selectedCategory === 'All' && styles.catFilterSelected]}
            onPress={() => setSelectedCategory('All')}
          >
            <Text style={{ fontSize: 20 }}>🏠</Text>
            <Text style={[styles.catFilterText, selectedCategory === 'All' && styles.catFilterTextSelected]}>Tất cả</Text>
          </TouchableOpacity>
          {categories.map((c, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.catFilter, selectedCategory === c.name && styles.catFilterSelected]}
              onPress={() => setSelectedCategory(c.name)}
            >
              <Text style={{ fontSize: 20 }}>{c.icon}</Text>
              <Text style={[styles.catFilterText, selectedCategory === c.name && styles.catFilterTextSelected]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={displayedItems}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.food?.name || 'Đồ ăn'}</Text>
              <Text style={{ color: '#555' }}>SL: {item.quantity} | {item.note}</Text>
              {item.useWithin && (
                <Text style={{ color: new Date(item.useWithin) < new Date() ? 'red' : 'green', fontSize: 12, fontWeight: 'bold' }}>
                  {new Date(item.useWithin) < new Date() ? 'ĐÃ HẾT HẠN: ' : 'HSD: '}
                  {new Date(item.useWithin).toLocaleDateString()}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteItem(item._id)} style={styles.delBtn}>
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>Tủ lạnh trống trơn.
          Bấm dấu + để đi chợ về nào!</Text>}
      />

      {/* Nút FAB Thêm đồ */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
      </TouchableOpacity>

      {/* MODAL NHẬP LIỆU */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📥 Cất đồ vào tủ</Text>

            <ScrollView style={{ maxHeight: 400 }}>
              {/* 1. Chọn món ăn */}
              <Text style={styles.label}>Tên món ăn:</Text>
              {selectedFood ? (
                <View style={styles.selectedBadge}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{selectedFood.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedFood(null)}>
                    <Text style={{ color: 'white', marginLeft: 10 }}>✕</Text>
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
                    <Text style={{ color: 'green', fontSize: 12, marginBottom: 10 }}>✨ Sẽ tạo món mới: "{searchQuery}"</Text>
                  )}
                  {/* 1.5. Chọn danh mục nếu là món mới */}
                  {!selectedFood && searchQuery.length > 0 && (
                    <View>
                      <Text style={styles.label}>Danh mục:</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {categories.map(c => (
                          <TouchableOpacity
                            key={c.name}
                            style={[styles.catBadge, category === c.name && styles.catBadgeSelected]}
                            onPress={() => setCategory(c.name)}
                          >
                            <Text style={{ marginRight: 5 }}>{c.icon}</Text>
                            <Text style={[styles.catText, category === c.name && styles.catTextSelected]}>{c.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* 1.6. Chọn đơn vị nếu là món mới */}
                  {!selectedFood && searchQuery.length > 0 && (
                    <View>
                      <Text style={styles.label}>Đơn vị tính:</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {units.map(u => (
                          <TouchableOpacity
                            key={u}
                            style={[styles.unitBadge, unit === u && styles.unitBadgeSelected]}
                            onPress={() => setUnit(u)}
                          >
                            <Text style={[styles.unitText, unit === u && styles.unitTextSelected]}>{u}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
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
                <Text style={{ color: 'gray' }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleAddItem} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>LƯU VÀO TỦ</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e3f2fd', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1565c0' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
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
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },

  // Category Badges in Modal
  catBadge: { flexDirection: 'row', padding: 8, borderRadius: 15, backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  catBadgeSelected: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  catText: { color: '#333' },
  catTextSelected: { color: 'white', fontWeight: 'bold' },

  // Home Screen Filter
  catFilter: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#ddd', height: 50, flexDirection: 'row' },
  catFilterSelected: { backgroundColor: '#1976d2', borderColor: '#1976d2' },
  catFilterText: { marginLeft: 5, color: '#555', fontWeight: '500' },
  catFilterTextSelected: { color: 'white' },

  // Unit Badges
  unitBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  unitBadgeSelected: { backgroundColor: '#e67e22', borderColor: '#e67e22' },
  unitText: { color: '#333', fontSize: 12 },
  unitTextSelected: { color: 'white', fontWeight: 'bold' }
});

export default FridgeScreen;
