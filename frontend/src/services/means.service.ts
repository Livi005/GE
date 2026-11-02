import { apiClient } from '../api/client';

export interface Means {
  idMean: number;
  nameMean: string;
  state: string;
  isAviable: boolean;
  isActive: boolean;
  type?: string;
}

export const MeansService = {
  getTechnological: async (): Promise<Means[]> => {
    const res = await apiClient.get('/technologicalmeans/list');
    return res.data?.value || res.data || [];
  },
  createTechnological: async (data: any) => {
    // El backend espera isActive obligatorio
    const payload = { ...data, isActive: data.isActive !== undefined ? data.isActive : true };
    const res = await apiClient.post('/technologicalmeans/create', payload);
    return res.data;
  },
  updateTechnological: async (id: number, data: any) => {
    const payload = { ...data, isActive: data.isActive !== undefined ? data.isActive : true };
    const res = await apiClient.put(`/technologicalmeans/update/${id}`, payload);
    return res.data;
  },
  deleteTechnological: async (id: number) => {
    await apiClient.delete(`/technologicalmeans/delete/${id}`);
  },

  getAuxiliary: async (): Promise<Means[]> => {
    const res = await apiClient.get('/auxiliarymeans/list');
    return res.data?.value || res.data || [];
  },
  createAuxiliary: async (data: any) => {
    const payload = { ...data, isActive: data.isActive !== undefined ? data.isActive : true };
    const res = await apiClient.post('/auxiliarymeans/create', payload);
    return res.data;
  },
  updateAuxiliary: async (id: number, data: any) => {
    const payload = { ...data, isActive: data.isActive !== undefined ? data.isActive : true };
    const res = await apiClient.put(`/auxiliarymeans/update/${id}`, payload);
    return res.data;
  },
  deleteAuxiliary: async (id: number) => {
    await apiClient.delete(`/auxiliarymeans/delete/${id}`);
  },
};