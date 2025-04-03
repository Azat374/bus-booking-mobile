import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInst = axios.create({
  baseURL: 'https\:\/\/7174-85-117-103-170\.ngrok-free\.app',
  timeout: 10000,
});


axiosInst.interceptors.request.use(
  async (config) => {
    if (config.url.includes('/user/signin') || config.url.includes('/user/signup')) {
      return config; // не добавлять токен при логине
    }
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export { axiosInst };
