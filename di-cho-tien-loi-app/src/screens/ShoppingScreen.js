import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import client from '../api/client';
import { useFocusEffect } from '@react-navigation/native';

const ShoppingScreen = () => {
  const [lists, setLists] = useState([]);
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
      fetchLists();
    } catch (e) { }
  }

  const deleteList = (id) => {
    Alert.alert("Xóa", "Xóa danh sách này?", [
      { text: "Hủy" },
      {
        text: "Xóa", onPress: async () => {
          await client.delete(`/it4788/shopping/${id}`);
          fetchLists();
        }
      }
    ]);
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
      fetchLists();
    } catch (e) { console.log(e); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 Danh Sách Đi Chợ</Text>

      {showInput && (
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TextInput style={styles.input} placeholder="Tên danh sách..." value={newListName} onChangeText={setNewListName} />
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
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#e65100', justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, backgroundColor: 'white', marginRight: 10 },
  addBtn: { backgroundColor: '#e65100', padding: 10, borderRadius: 5, justifyContent: 'center' }
});
export default ShoppingScreen;
