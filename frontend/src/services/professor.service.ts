import { apiClient } from '../api/client';

export interface Professor {
  id: number;
  professor: {
    nameProf: string;
    contract: string;
    spec: string;
    salary: number;
    isDean: boolean;
    laboralExperience: number;
    useAuxMean: boolean;
  };
}

export const ProfessorService = {
  getAll: async (): Promise<Professor[]> => {
    try {
      const res = await apiClient.get('/professor/list');
      return res.data?.value || res.data || [];
    } catch (error) {
      console.error("Error cargando profesores", error);
      return [];
    }
  },
  create: async (data: any) => (await apiClient.post('/professor/create', data)).data,
  update: async (id: number, data: any) => (await apiClient.put(`/professor/update/${id}`, data)).data,
  delete: async (id: number) => (await apiClient.delete(`/professor/delete/${id}`)).data
};