import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInst = axios.create({
  baseURL: 'https\:\/\/ff40-176-64-26-145\.ngrok-free\.app',
  timeout: 10000,
});

axiosInst.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInst };
