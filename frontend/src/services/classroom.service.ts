import { apiClient } from '../api/client';

export interface ClassRoom {
  idClassR: number;
  location: string;
  isAviable: boolean;
  capacity: number;
}

export const ClassRoomService = {
  getAll: async (): Promise<ClassRoom[]> => {
    try {
      const res = await apiClient.get('/classroom/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando aulas:", error.response?.data?.detail || error.message);
      throw error;
    }
  },
  create: async (data: any) => {
    const res = await apiClient.post('/classroom/create', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await apiClient.put(`/classroom/update/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    try {
      const res = await apiClient.delete(`/classroom/delete/${id}`);
      if (res.status === 204) return true;
    } catch (error: any) {
      console.error("Error eliminando aula:", error.response?.data?.detail || error.message);
      throw error;
    }
  }
};