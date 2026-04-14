import axios from 'axios';

export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || API_BASE).replace(/\/$/, '');

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 60000,
});
