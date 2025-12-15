import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const res = await client.post('/login', { email, password });
      setLoading(false);
      
      if (res.data.code === '00047') {
        await AsyncStorage.setItem('userToken', res.data.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data));
        // Gọi hàm callback để App.js chuyển màn hình
        if (onLoginSuccess) onLoginSuccess();
      } else {
        Alert.alert("Thất bại", res.data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Lỗi", "Không thể đăng nhập");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 ĐI CHỢ TIỆN LỢI</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop: 20}} onPress={() => navigation.navigate('Register')}>
        <Text style={{color: '#3498db'}}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 40 },
  input: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { width: '100%', backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default LoginScreen;
