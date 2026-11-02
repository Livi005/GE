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
    const res = await apiClient.get('/subject/list');
    return res.data?.value || res.data || [];
  },
  create: async (data: any) => {
    // El backend NO espera idInstitution
    const res = await apiClient.post('/subject/create', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await apiClient.put(`/subject/update/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`/subject/delete/${id}`);
  }
};