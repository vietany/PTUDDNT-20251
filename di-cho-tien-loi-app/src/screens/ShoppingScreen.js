import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import client from '../api/client';
import { useFocusEffect } from '@react-navigation/native';

import Toast from '../components/Toast';

const ShoppingScreen = () => {
  const [lists, setLists] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };
  const [newListName, setNewListName] = useState('');
  const [showInput, setShowInput] = useState(false);

  // State cho việc thêm món (Thay thế Alert.prompt)
  const [addingToListId, setAddingToListId] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  useFocusEffect(
    React.useCallback(() => { fetchLists(); }, [])
  );

  const fetchLists = async () => {
    try {
      const res = await client.get('/it4788/shopping');
      if (res.data.code === '00292') setLists(res.data.data);
    } catch (e) { console.log(e); }
  };

  const createList = async () => {
    if (!newListName) return;
    try {
      await client.post('/it4788/shopping', { name: newListName });
      setNewListName('');
      setShowInput(false);
      showToast('Tạo danh sách thành công!', 'success');
      fetchLists();
    } catch (e) { showToast('Lỗi khi tạo danh sách', 'error'); }
  }

  const deleteList = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Bạn có chắc chắn muốn xóa danh sách này không?")) {
        handleDelete(id);
      }
    } else {
      Alert.alert("Xóa", "Xóa danh sách này?", [
        { text: "Hủy" },
        { text: "Xóa", onPress: () => handleDelete(id) }
      ]);
    }
  }

  const handleDelete = async (id) => {
    try {
      console.log("[DELETE] Calling API for ID:", id);
      await client.delete(`/it4788/shopping/${id}`);
      showToast('Đã xóa danh sách', 'success');
      fetchLists();
    } catch (e) {
      console.log("[DELETE ERROR]", e);
      showToast('Lỗi khi xóa: ' + (e.message || 'Unknown'), 'error');
    }
  }

  const toggleTask = async (listId, taskId) => {
    // Optimistic update (Cập nhật giao diện trước cho mượt)
    const newLists = lists.map(l => {
      if (l._id === listId) {
        l.tasks = l.tasks.map(t => t._id === taskId ? { ...t, isBought: !t.isBought } : t);
      }
      return l;
    });
    setLists(newLists);

    // Gọi API sau
    await client.put('/it4788/shopping/task/toggle', { listId, taskId });
  }

  const submitNewItem = async (listId) => {
    if (!newItemName) return;
    try {
      await client.post('/it4788/shopping/task', { listId, foodName: newItemName, quantity: '1' });
      setNewItemName('');
      setAddingToListId(null);
      setAddingToListId(null);
      showToast('Thêm món thành công!', 'success');
      fetchLists();
    } catch (e) {
      console.log(e);
      showToast('Lỗi khi thêm món', 'error');
    }
  }

  return (
    <View style={styles.container}>
      {toast.message ? <Toast message={toast.message} type={toast.type} onHide={() => setToast({ message: '', type: '' })} /> : null}
      <Text style={styles.header}>📝 Danh Sách Đi Chợ</Text>

      {showInput && (
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="Tên danh sách..."
            placeholderTextColor="#888"
            value={newListName}
            onChangeText={setNewListName}
          />
          <TouchableOpacity onPress={createList} style={styles.addBtn}><Text style={{ color: 'white' }}>Lưu</Text></TouchableOpacity>
        </View>
      )}

      <FlatList
        data={lists}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.listName}>{item.name}</Text>
              <TouchableOpacity onPress={() => deleteList(item._id)}><Text style={{ color: 'red' }}>Xóa list</Text></TouchableOpacity>
            </View>

            {/* List Task */}
            {item.tasks && item.tasks.map(task => (
              <TouchableOpacity key={task._id} onPress={() => toggleTask(item._id, task._id)} style={styles.taskRow}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>{task.isBought ? '☑️' : '⬜'}</Text>
                <Text style={[styles.taskText, task.isBought && styles.strikeText]}>{task.foodName}</Text>
              </TouchableOpacity>
            ))}

            {/* Input thêm món mới (Thay cho Alert.prompt) */}
            {addingToListId === item._id ? (
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TextInput
                  style={[styles.input, { marginRight: 5 }]}
                  placeholder="Tên món..."
                  placeholderTextColor="#888"
                  autoFocus={true}
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                <TouchableOpacity
                  onPress={() => submitNewItem(item._id)}
                  style={{ backgroundColor: '#27ae60', padding: 10, borderRadius: 5, marginRight: 5 }}>
                  <Text style={{ color: 'white' }}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAddingToListId(null)}
                  style={{ backgroundColor: '#95a5a6', padding: 10, borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>Hủy</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setAddingToListId(item._id); setNewItemName(''); }} style={{ marginTop: 10 }}>
                <Text style={{ color: '#e65100' }}>+ Thêm món</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowInput(!showInput)}>
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff3e0' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#e65100' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#e65100' },
  listName: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  taskText: { fontSize: 16 },
  strikeText: { textDecorationLine: 'line-through', color: 'gray' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#e65100', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 5 },
  input: { flex: 1, borderWidth: 1, borderColor: '#999', padding: 10, borderRadius: 5, backgroundColor: 'white', marginRight: 10, color: '#333' },
  addBtn: { backgroundColor: '#e65100', padding: 10, borderRadius: 5, justifyContent: 'center' }
});
export default ShoppingScreen;
