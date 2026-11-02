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
    try {
      const res = await apiClient.get('/technologicalmeans/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando medios tecnológicos:", error.response?.data?.detail || error.message);
      throw error;
    }
  },
  createTechnological: async (data: any) => {
    // Aseguramos que isActive se envía
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
    try {
      const res = await apiClient.delete(`/technologicalmeans/delete/${id}`);
      if (res.status === 204) return true;
    } catch (error: any) {
      console.error("Error eliminando medio tecnológico:", error.response?.data?.detail || error.message);
      throw error;
    }
  },

  getAuxiliary: async (): Promise<Means[]> => {
    try {
      const res = await apiClient.get('/auxiliarymeans/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando medios auxiliares:", error.response?.data?.detail || error.message);
      throw error;
    }
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
    try {
      const res = await apiClient.delete(`/auxiliarymeans/delete/${id}`);
      if (res.status === 204) return true;
    } catch (error: any) {
      console.error("Error eliminando medio auxiliar:", error.response?.data?.detail || error.message);
      throw error;
    }
  },
};