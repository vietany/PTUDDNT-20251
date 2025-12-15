import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, StyleSheet, ScrollView } from 'react-native';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupScreen = () => {
  const [group, setGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchGroup();
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const u = await AsyncStorage.getItem('userInfo');
    if(u) setUser(JSON.parse(u));
  }

  const fetchGroup = async () => {
    try {
      const res = await client.get('/it4788/group/my-group');
      if (res.data.code === '00098') setGroup(res.data.data);
    } catch (error) { setGroup(null); }
  };

  const createGroup = async () => {
    if (!newGroupName) return;
    try {
      await client.post('/it4788/group', { name: newGroupName });
      fetchGroup();
    } catch (e) { Alert.alert("Lỗi", "Không tạo được nhóm"); }
  };

  const inviteMember = async () => {
    if (!inviteEmail) return;
    try {
      await client.post('/it4788/group/invite', { email: inviteEmail });
      Alert.alert("Thành công", "Đã thêm thành viên mới!");
      setInviteEmail('');
      fetchGroup();
    } catch (e) { 
        Alert.alert("Lỗi", e.response?.data?.message || "Không mời được"); 
    }
  };

  const leaveGroup = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn rời nhóm?", [
      { text: "Hủy", style: "cancel" },
      { text: "Rời nhóm", style: 'destructive', onPress: async () => {
          try {
            await client.post('/it4788/group/leave');
            setGroup(null);
            Alert.alert("Thông báo", "Bạn đã rời nhóm.");
          } catch (e) { Alert.alert("Lỗi", "Không rời được nhóm"); }
      }}
    ]);
  };

  const removeMember = async (memberId) => {
    try {
        await client.post('/it4788/group/remove', { memberId });
        fetchGroup();
    } catch (e) { Alert.alert("Lỗi", "Không xóa được"); }
  };

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bạn chưa có nhóm</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Tên nhóm mới..." 
            value={newGroupName}
            onChangeText={setNewGroupName}
        />
        <TouchableOpacity style={styles.button} onPress={createGroup}>
            <Text style={styles.buttonText}>TẠO NHÓM MỚI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAdmin = group.admin === user?._id || (typeof group.admin === 'object' && group.admin._id === user?._id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>🏠 {group.name}</Text>
        <TouchableOpacity onPress={leaveGroup} style={styles.leaveBtn}>
            <Text style={{color:'white', fontWeight:'bold'}}>Rời nhóm</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Thành viên ({group.members.length})</Text>
      {group.members.map((mem) => (
        <View key={mem._id} style={styles.memberRow}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={styles.avatar}><Text style={{color:'white'}}>{mem.name[0]}</Text></View>
                <View>
                    <Text style={styles.memberName}>{mem.name} {mem._id === group.admin._id ? '👑' : ''}</Text>
                    <Text style={styles.memberEmail}>{mem.email}</Text>
                </View>
            </View>
            {isAdmin && mem._id !== user._id && (
                <TouchableOpacity onPress={() => removeMember(mem._id)}>
                    <Text style={{color:'red'}}>Kick</Text>
                </TouchableOpacity>
            )}
        </View>
      ))}

      {isAdmin && (
          <View style={styles.inviteBox}>
            <Text style={styles.subtitle}>Mời thành viên</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Nhập email người cần mời..." 
                value={inviteEmail}
                onChangeText={setInviteEmail}
                autoCapitalize="none"
            />
            <TouchableOpacity style={[styles.button, {backgroundColor:'#27ae60'}]} onPress={inviteMember}>
                <Text style={styles.buttonText}>GỬI LỜI MỜI</Text>
            </TouchableOpacity>
          </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#fff' },
  headerBox: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#d35400' },
  leaveBtn: { backgroundColor: '#c0392b', padding: 8, borderRadius: 5 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#d35400', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  memberRow: { flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginBottom: 10, padding: 10, backgroundColor: '#fdf2e9', borderRadius: 8 },
  avatar: { width: 40, height: 40, backgroundColor: '#e67e22', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  memberName: { fontWeight: 'bold', fontSize: 16 },
  memberEmail: { color: 'gray', fontSize: 12 },
  inviteBox: { marginTop: 20, padding: 15, backgroundColor: '#ecf0f1', borderRadius: 10 }
});
export default GroupScreen;
