import axios from 'axios';
import echo from '../Listener/echo';

const axiosClient = axios.create({
  baseURL: 'http://chatapp-backend.test/api/',
  headers: {
    'Accept': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (echo && echo.socketId()) {
      config.headers['X-Socket-ID'] = echo.socketId();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
