import { apiClient } from '../api/client';

export interface Student {
  id: number;
  idC: number;
  name1: string;
  lastName1: string;
  lastName2?: string;
  birthDate: string;
  gender: string;
  docType: string;
  docNumber: string;
  email: string;
  phone: string;
  address: string;
  level: string;
  grade: string;
  section: string;
  admissionDate: string;
  academicYear: string;
  initialStatus: string;
  notes?: string;
  tutorName: string;
  tutorPhone: string;
  emergencyContact: string;
  isActive: boolean;
  idInstitution: number;
}

export const StudentService = {
  getAll: async (): Promise<Student[]> => {
    try {
      const res = await apiClient.get('/student/list');
      return res.data?.value || res.data || [];
    } catch (error) {
      console.error("Error cargando estudiantes", error);
      return [];
    }
  },
  create: async (data: any) => (await apiClient.post('/student/create', data)).data,
  update: async (id: number, data: any) => (await apiClient.put(`/student/update/${id}`, data)).data,
  delete: async (id: number) => (await apiClient.delete(`/student/delete/${id}`)).data
};