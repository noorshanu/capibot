import axios from 'axios';
import WebApp from '@twa-dev/sdk';
const api = axios.create({
    baseURL: `http://localhost:3000/api`,
    // baseURL: `https://tapnot.xyz/api`,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('api-access-token');
      // Add headers to the request
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      config.headers['initData'] = WebApp.initData;
      config.headers['auth-type'] = WebApp.initDataUnsafe.user ? 'telegram' : 'wallet';
      // Add any other headers you need
  
      return config;
    },
    (error) => {
      // Handle the error
      return Promise.reject(error);
    }
  );

  export default api;