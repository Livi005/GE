import { apiClient } from '../api/client';

export interface StudentResponse {
  id: number;
  idC: number;
  student: {
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
    idC: number;
  };
}

export const StudentService = {
  getAll: async (): Promise<StudentResponse[]> => {
    try {
      const res = await apiClient.get('/student/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando estudiantes:", error.response?.data?.detail || error.message);
      throw error; // Lanzar error para que la UI lo muestre
    }
  },
  create: async (data: any) => (await apiClient.post('/student/create', data)).data,
  update: async (id: number, data: any) => (await apiClient.put(`/student/update/${id}`, data)).data,
  delete: async (id: number) => {
    try {
      const res = await apiClient.delete(`/student/delete/${id}`);
      if (res.status === 204) return true;
    } catch (error: any) {
      console.error("Error eliminando estudiante:", error.response?.data?.detail || error.message);
      throw error;
    }
  }
};