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
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    console.log(`[LOGIN] Đang gọi API tới: ${client.defaults.baseURL}/login`);
    console.log(`[LOGIN] Email: ${email}`);

    try {
      
      const res = await client.post('/it4788/user/login', { email, password }, { timeout: 5000 });
      
      console.log("[LOGIN] Kết quả:", res.status, res.data);
      setLoading(false);
      
      
      if (res.data.code === '00047') {
        await AsyncStorage.setItem('userToken', res.data.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data));
        
        if (onLoginSuccess) {
            onLoginSuccess();
        } else {
            
            Alert.alert("✅ Thành công", "Đăng nhập OK! Hãy khởi động lại App để vào trong.");
        }
      } else {
        
        Alert.alert("❌ Đăng nhập thất bại", res.data.message || "Email hoặc mật khẩu không đúng.");
      }

    } catch (error) {
      setLoading(false);
      console.log("[LOGIN ERROR]", error);

      
      if (error.response) {
        
        if (error.response.status === 404) {
            Alert.alert("❌ Lỗi Server (404)", "Đường dẫn API Login không tìm thấy.\n(Có thể do Backend chưa bỏ comment route User).");
        } else {
            const msg = error.response.data?.message || "Lỗi không xác định từ Server.";
            Alert.alert(`❌ Lỗi Server (${error.response.status})`, msg);
        }
      } else if (error.request) {
        
        Alert.alert("⚠️ Không kết nối được", "Không tìm thấy Server.\n1. Kiểm tra xem đã chạy 'node app.js' chưa?\n2. Kiểm tra xem IP máy tính có đổi không?");
      } else {
        
        Alert.alert("❌ Lỗi Ứng dụng", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 ĐI CHỢ TIỆN LỢI</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Mật khẩu" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop: 20, padding: 10}} onPress={() => navigation.navigate('Register')}>
        <Text style={{color: '#3498db', fontWeight: 'bold'}}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 40 },
  input: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { width: '100%', backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;
