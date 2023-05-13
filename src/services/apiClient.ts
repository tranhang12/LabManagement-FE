import axios from 'axios';
export const baseURL = process.env.NEXT_PUBLIC_API_URL
export const baseWsURL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000"
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;