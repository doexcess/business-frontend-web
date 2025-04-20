// lib/axiosInstance.js
import axios from 'axios';

const apiClientV1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/v1', // Set your API base URL here
  timeout: 10000, // Optional: Set a timeout for requests
});

// Optional: Add interceptors
apiClientV1.interceptors.request.use(
  (config) => {
    // You can add authorization tokens or other headers here
    const token = localStorage.getItem('token'); // Example for a token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClientV1;
