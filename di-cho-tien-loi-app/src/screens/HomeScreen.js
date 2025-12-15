import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Lấy tên User
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) setUser(JSON.parse(userInfo));

      // Gọi API lấy danh mục (Của Hiệp)
      const res = await client.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào, {user?.name} 👋</Text>
        <Text style={styles.subGreeting}>Hôm nay nhà mình ăn gì?</Text>
      </View>

      <Text style={styles.sectionTitle}>Danh mục thực phẩm</Text>
      
      {loading ? <ActivityIndicator size="large" color="#27ae60" /> : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{textAlign:'center'}}>Chưa có danh mục nào (Gọi Hiệp nhập data đi)</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { marginBottom: 20, marginTop: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  subGreeting: { fontSize: 16, color: '#7f8c8d' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#27ae60' },
  card: { flex: 1, margin: 5, padding: 20, backgroundColor: '#e8f5e9', borderRadius: 10, alignItems: 'center' },
  cardText: { fontWeight: '600', color: '#2ecc71' }
});

export default HomeScreen;
