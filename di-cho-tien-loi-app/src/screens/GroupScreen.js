import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import client from '../api/client';

const GroupScreen = () => {
  const [group, setGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const res = await client.get('/api/groups/my-group');
      if (res.data.success) {
        setGroup(res.data.data);
      }
    } catch (error) {
      // Nếu 404 nghĩa là chưa có nhóm
      setGroup(null);
    }
  };

  const createGroup = async () => {
    if (!newGroupName) return;
    try {
      const res = await client.post('/api/groups', { name: newGroupName });
      if (res.data.success) {
        setGroup(res.data.data);
        Alert.alert("Thành công", "Đã tạo nhóm gia đình!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không tạo được nhóm");
    }
  };

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bạn chưa có nhóm</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Đặt tên nhóm (VD: Gia đình siêu nhân)" 
            value={newGroupName}
            onChangeText={setNewGroupName}
        />
        <TouchableOpacity style={styles.button} onPress={createGroup}>
            <Text style={styles.buttonText}>TẠO NHÓM MỚI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 {group.name}</Text>
      <Text style={styles.subtitle}>Thành viên:</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <View style={styles.avatar}><Text style={{color:'#fff'}}>{item.name[0]}</Text></View>
            <View>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#d35400' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#d35400', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  memberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#fdf2e9', borderRadius: 8 },
  avatar: { width: 40, height: 40, backgroundColor: '#e67e22', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  memberName: { fontWeight: 'bold', fontSize: 16 },
  memberEmail: { color: 'gray' }
});

export default GroupScreen;
