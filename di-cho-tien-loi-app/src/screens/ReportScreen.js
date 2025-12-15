import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import client from '../api/client';

const ReportScreen = () => {
  const [stats, setStats] = useState({ fridgeCount: 0, expiringCount: 0, listCount: 0 });

  useEffect(() => {
      const fetchStats = async () => {
          try {
              const res = await client.get('/it4788/report');
              if(res.data.code === '00109') setStats(res.data.data);
          } catch(e){}
      };
      fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Báo Cáo Gia Đình</Text>
      
      <View style={styles.grid}>
          <View style={[styles.box, {backgroundColor: '#e3f2fd'}]}>
              <Text style={styles.number}>{stats.fridgeCount}</Text>
              <Text style={styles.label}>Món trong tủ</Text>
          </View>
          
          <View style={[styles.box, {backgroundColor: '#ffebee'}]}>
              <Text style={[styles.number, {color: 'red'}]}>{stats.expiringCount}</Text>
              <Text style={styles.label}>Sắp hết hạn!</Text>
          </View>

          <View style={[styles.box, {backgroundColor: '#fff3e0'}]}>
              <Text style={styles.number}>{stats.listCount}</Text>
              <Text style={styles.label}>List cần mua</Text>
          </View>
      </View>

      <View style={styles.infoBox}>
          <Text style={{fontSize: 16, lineHeight: 24}}>
            💡 <Text style={{fontWeight:'bold'}}>Mẹo:</Text> Bạn có {stats.expiringCount} món sắp hết hạn trong 3 ngày tới.
            Hãy vào mục "Công thức" để tìm món nấu ngay nhé!
          </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  box: { width: '48%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginBottom: 15 },
  number: { fontSize: 40, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 16, color: '#555', marginTop: 5 },
  infoBox: { marginTop: 20, padding: 20, backgroundColor: '#f0f0f0', borderRadius: 10 }
});
export default ReportScreen;
