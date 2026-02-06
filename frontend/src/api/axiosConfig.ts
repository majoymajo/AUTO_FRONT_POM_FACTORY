import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? '/api';

export const axiosConfig = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default axiosConfig;
