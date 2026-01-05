import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import client from '../api/client';

const CategoryDetailScreen = ({ route }) => {
  const { categoryName } = route.params; // Lấy tên danh mục được truyền sang
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodsByCategory();
  }, []);

  const fetchFoodsByCategory = async () => {
    try {
      // Gọi API lấy tất cả món ăn
      const res = await client.get('/it4788/food');
      if (res.data.code === '00188') {
        // Lọc danh sách món ăn theo Category ở phía Client (cho đơn giản)
        // (Thực tế nên có API filter từ Backend, nhưng đề bài không bắt buộc)
        const allFoods = res.data.data;
        const filtered = allFoods.filter(f => f.category === categoryName);
        setFoods(filtered);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh mục: {categoryName}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#27ae60" />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Nếu có ảnh thì hiện, không thì hiện icon mặc định */}
              <View style={styles.iconPlaceholder}>
                <Text style={{ fontSize: 24 }}>🥘</Text>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={{ color: 'gray' }}>Đơn vị: {item.unit}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có món nào thuộc nhóm này.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#27ae60' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  foodName: { fontSize: 18, fontWeight: 'bold' },
  iconPlaceholder: { width: 50, height: 50, backgroundColor: '#e8f5e9', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontStyle: 'italic' }
});

export default CategoryDetailScreen;
