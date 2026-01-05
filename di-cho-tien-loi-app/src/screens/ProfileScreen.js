import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import client from '../api/client';
import Toast from '../components/Toast';

const ProfileScreen = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userInfo').then(data => {
      if (data) {
        const u = JSON.parse(data);
        setUser(u);
        setName(u.name || '');
        setPhone(u.phone || '');
        const validDob = u.dob ? new Date(u.dob).toISOString().split('T')[0] : '';
        // Convert YYYY-MM-DD to DD-MM-YYYY for display in input if needed, 
        // but for text input it is easier to keep standard or allow user to type.
        // Let's just keep YYYY-MM-DD for input value to avoid parsing hell for now, or just empty.
        // Actually user asked for dd-mm-yyyy format.
        // Let's store raw input.
        setDob(validDob.split('-').reverse().join('-'));
      }
    })
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleUpdate = async () => {
    try {
      // Convert dd-mm-yyyy to YYYY-MM-DD for backend
      const [d, m, y] = dob.split('-');
      const formattedDob = `${y}-${m}-${d}`;

      const res = await client.put('/it4788/user/profile', {
        name, phone, dob: formattedDob
      });
      if (res.data.code === '00050') {
        const updatedUser = res.data.data;
        await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        showToast("Cập nhật thành công!", "success");
      }
    } catch (e) { showToast("Lỗi cập nhật", "error"); }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setIsLoggedIn(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {toast.message ? <Toast message={toast.message} type={toast.type} onHide={() => setToast({ message: '', type: '' })} /> : null}

      <View style={styles.avatar}>
        <Text style={{ fontSize: 40 }}>{user?.name ? user.name[0] : '?'}</Text>
      </View>

      {!isEditing ? (
        <>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone && <Text style={styles.info}>📞 {user.phone}</Text>}
          {user?.dob && <Text style={styles.info}>🎂 {new Date(user.dob).toLocaleDateString('vi-VN')}</Text>}

          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Text style={{ color: 'white' }}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ tên" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" keyboardType="phone-pad" />
          <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="Ngày sinh (dd-mm-yyyy)" />

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: '#27ae60', marginRight: 10 }]} onPress={handleUpdate}>
              <Text style={{ color: 'white' }}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: '#7f8c8d' }]} onPress={() => setIsEditing(false)}>
              <Text style={{ color: 'white' }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ecf0f1', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: 'gray', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 5, color: '#333' },

  editBtn: { padding: 10, backgroundColor: '#3498db', borderRadius: 5, marginBottom: 20, width: 150, alignItems: 'center' },
  input: { width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  logoutBtn: { padding: 15, width: '80%', backgroundColor: '#e74c3c', borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});

export default ProfileScreen;
