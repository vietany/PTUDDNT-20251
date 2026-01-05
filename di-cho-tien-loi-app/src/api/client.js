import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Lấy địa chỉ IP của máy đang chạy Expo (Host)
const getBaseUrl = () => {
  // Ưu tiên lấy từ biến môi trường nếu có (cho Prod)
  if (process.env.API_URL) return process.env.API_URL;

  // Lấy IP từ Expo Config (cho Dev)
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    // Backend chạy ở port 5000
    return `http://${ip}:5000`;
  }

  // Fallback cho trường hợp không lấy được (hoặc chạy trên Web Localhost)
  return 'http://localhost:5000';
}

const baseURL = getBaseUrl();

console.log(`[API CLIENT] Connecting to Server at: ${baseURL}`);

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- QUAN TRỌNG: INTERCEPTOR ---
// Tự động thêm Token vào mỗi request gửi đi
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
