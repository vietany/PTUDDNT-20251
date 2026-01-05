import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from '../components/Toast';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigation = useNavigation();

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleLogin = async () => {

    if (!email || !password) {
      showToast("Vui lòng nhập đầy đủ Email và Mật khẩu.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Định dạng email không hợp lệ.", "error");
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
          showToast("Đăng nhập thành công!", "success");
        }
      } else {
        showToast(res.data.message || "Email hoặc mật khẩu không đúng.", "error");
      }

    } catch (error) {
      setLoading(false);
      console.log("[LOGIN ERROR]", error);

      if (error.response) {

        if (error.response.status === 404) {
          showToast("Lỗi Server (404): API Login không tìm thấy.", "error");
        } else {
          const msg = error.response.data?.message || "Lỗi không xác định từ Server.";
          showToast(msg, "error");
        }
      } else if (error.request) {
        showToast("Không kết nối được Server.", "error");
      } else {
        showToast(error.message, "error");
      }
    }
  };

  return (
    <View style={styles.container}>
      {toast.message ? <Toast message={toast.message} type={toast.type} onHide={() => setToast({ message: '', type: '' })} /> : null}
      <Text style={styles.title}>🛒 ĐI CHỢ TIỆN LỢI</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 20, padding: 10 }} onPress={() => navigation.navigate('Register')}>
        <Text style={{ color: '#3498db', fontWeight: 'bold' }}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 40 },
  input: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#999', color: '#333' },
  button: { width: '100%', backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;
