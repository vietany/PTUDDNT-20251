import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên, email và mật khẩu");
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
      if (res.data.code === '00035') { 
        Alert.alert(
          "Thành công", 
          "Đăng ký tài khoản thành công! Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Thất bại", res.data.message || "Đăng ký lỗi.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Lỗi Register:", error);
      if (error.response) {
         Alert.alert("Lỗi Server", error.response.data.message || "Lỗi xử lý");
      } else {
         Alert.alert("Lỗi Mạng", "Không kết nối được tới Server.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>
      <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />

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
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#3498db', fontSize: 16 },
});
export default RegisterScreen;
