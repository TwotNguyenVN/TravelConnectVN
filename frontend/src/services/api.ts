import axios from 'axios';
import { supabase } from '../utils/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log(`DEBUG - Axios Request: ${config.method?.toUpperCase()} ${config.url} - Token: ${session?.access_token ? 'Found' : 'NOT FOUND'}`);
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Return the full body { success, message, data }
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    console.error(`DEBUG - Axios Error: ${message}`, error.response?.data);
    
    // Check if unauthorized (401)
    if (error.response?.status === 401) {
      console.warn('DEBUG - Axios Interceptor: 401 Unauthorized detected. Signing out and clearing session...');
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during auto sign-out:', err);
      }
    }
    
    return Promise.reject(error);
  }
);

import type { AxiosInstance, AxiosRequestConfig } from 'axios';


interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export default api as unknown as CustomAxiosInstance;

