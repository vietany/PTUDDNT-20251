import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) setUser(JSON.parse(userInfo));
      const res = await client.get('/it4788/category');
      if (res.data.data) setCategories(res.data.data);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào, {user?.name} 👋</Text>
      </View>

      {/* MENU CHỨC NĂNG MỚI */}
      <View style={styles.quickMenu}>
          <TouchableOpacity style={[styles.menuBtn, {backgroundColor:'#fff8e1'}]} onPress={() => navigation.navigate('Meal')}>
              <Text style={{fontSize:24}}>📅</Text>
              <Text style={styles.menuText}>Lịch Ăn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuBtn, {backgroundColor:'#f3e5f5'}]} onPress={() => navigation.navigate('Recipe')}>
              <Text style={{fontSize:24}}>📖</Text>
              <Text style={styles.menuText}>Công Thức</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuBtn, {backgroundColor:'#e0f7fa'}]} onPress={() => navigation.navigate('Report')}>
              <Text style={{fontSize:24}}>📊</Text>
              <Text style={styles.menuText}>Báo Cáo</Text>
          </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Danh mục thực phẩm</Text>
      
      {loading ? <ActivityIndicator size="large" color="#27ae60" /> : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('CategoryDetail', { categoryName: item.name })}
            >
              {item.image ? (
                  <Image source={{uri: item.image}} style={{width: 50, height: 50, marginBottom: 10}} />
              ) : (
                  <Text style={{fontSize: 40, marginBottom: 10}}>📦</Text>
              )}
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { marginBottom: 20, marginTop: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  quickMenu: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  menuBtn: { width: '30%', padding: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  menuText: { marginTop: 5, fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#27ae60' },
  card: { flex: 1, margin: 5, padding: 20, backgroundColor: '#e8f5e9', borderRadius: 10, alignItems: 'center', justifyContent:'center' },
  cardText: { fontWeight: '600', color: '#2ecc71', textAlign:'center' }
});
export default HomeScreen;
