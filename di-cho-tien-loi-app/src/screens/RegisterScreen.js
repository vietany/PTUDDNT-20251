import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import Toast from '../components/Toast';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigation = useNavigation();

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast("Vui lòng nhập đầy đủ tên, email và mật khẩu", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Định dạng email không hợp lệ.", "error");
      return;
    }

    setLoading(true);
    try {
      // FIX: Đường dẫn đúng theo tài liệu là POST /it4788/user (không có /register)
      const res = await client.post('/it4788/user', {
        name,
        email,
        password
      });

      setLoading(false);

      // Code 00035: Đăng ký thành công
      // Code 00035: Đăng ký thành công
      if (res.data.code === '00035') {
        showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        showToast(res.data.message || "Đăng ký lỗi.", "error");
      }
    } catch (error) {
      setLoading(false);
      console.log("Lỗi Register:", error);
      if (error.response) {
        showToast(error.response.data.message || "Lỗi xử lý", "error");
      } else {
        showToast("Không kết nối được tới Server.", "error");
      }
    }
  };

  return (
    <View style={styles.container}>
      {toast.message ? <Toast message={toast.message} type={toast.type} onHide={() => setToast({ message: '', type: '' })} /> : null}
      <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>
      <TextInput style={styles.input} placeholder="Họ và tên" placeholderTextColor="#888" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mật khẩu" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#27ae60', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#999', color: '#333' },
  button: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#3498db', fontSize: 16 },
});
export default RegisterScreen;
