import { apiClient } from '../api/client';

export interface ProfessorResponse {
  id: number;
  professor: {
    nameProf: string;
    contract: string;
    spec: string;
    salary: number;
    isDean: boolean;
    laboralExperience: number;
    useAuxMean: boolean;
    idInstitution: number;
  };
}

export const ProfessorService = {
  getAll: async (): Promise<ProfessorResponse[]> => {
    try {
      const res = await apiClient.get('/professor/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando profesores:", error.response?.data?.detail || error.message);
      throw error; // Importante para que la UI muestre el error
    }
  },
  create: async (data: any) => {
    const res = await apiClient.post('/professor/create', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await apiClient.put(`/professor/update/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    try {
      const res = await apiClient.delete(`/professor/delete/${id}`);
      if (res.status === 204) return true;
    } catch (error: any) {
      console.error("Error eliminando profesor:", error.response?.data?.detail || error.message);
      throw error;
    }
  }
};