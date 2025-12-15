import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userInfo').then(data => {
        if(data) setUser(JSON.parse(data));
    })
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={{fontSize: 40}}>{user?.name ? user.name[0] : '?'}</Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ecf0f1', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: 'gray', marginBottom: 40 },
  logoutBtn: { padding: 15, width: '80%', backgroundColor: '#e74c3c', borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});

export default ProfileScreen;
