import axios from 'axios';

// Apuntamos al Backend en localhost según el informe
export const apiClient = axios.create({
  baseURL: 'http://localhost:5164',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Añade el token a cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // El backend espera "Bearer {token}"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Si el backend devuelve 401 (No autorizado), cerramos sesión
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('isDean');
      localStorage.removeItem('institutionId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);