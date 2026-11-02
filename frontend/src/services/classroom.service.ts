import { apiClient } from '../api/client';

export interface ClassRoom {
  idClassR: number;
  location: string;
  isAviable: boolean;
}

export const ClassRoomService = {
  getAll: async (): Promise<ClassRoom[]> => {
    try {
      const res = await apiClient.get('/classroom/list');
      return res.data?.value || res.data || [];
    } catch (error) {
      console.error("Error cargando aulas", error);
      return [];
    }
  },
  create: async (data: any) => (await apiClient.post('/classroom/create', data)).data,
  update: async (id: number, data: any) => (await apiClient.put(`/classroom/update/${id}`, data)).data,
  delete: async (id: number) => (await apiClient.delete(`/classroom/delete/${id}`)).data
};