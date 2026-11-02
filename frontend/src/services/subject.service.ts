import { apiClient } from '../api/client';

export interface Subject {
  idSub: number;
  nameSub: string;
  studyProgram: string;
  courseLoad: number;
  idClassRoom: number;
  classRoomLocation?: string;
}

export const SubjectService = {
  getAll: async (): Promise<Subject[]> => {
    try {
      const res = await apiClient.get('/subject/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando asignaturas:", error.response?.data?.detail || error.message);
      throw error;
    }
  },
  create: async (data: any) => {
    const res = await apiClient.post('/subject/create', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await apiClient.put(`/subject/update/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    try {
      const res = await apiClient.delete(`/subject/delete/${id}`);
      if (res.status === 204) return true;
    } catch (error: any) {
      console.error("Error eliminando asignatura:", error.response?.data?.detail || error.message);
      throw error;
    }
  }
};