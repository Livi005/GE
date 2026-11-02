import { apiClient } from '../api/client';

export const ReservationService = {
  // Obtener materias del profesor para el paso 1
  getSubjects: async (userName: string) => {
    try {
      const res = await apiClient.get(`/professorStudentSubject/getsubjects?userName=${userName}`);
      return res.data?.value || res.data || [];
    } catch (error) {
      return [];
    }
  },

  // Reservar el aula y los medios
  reserve: async (data: any) => {
    const res = await apiClient.post('/classroommeans/reserveClassRoomAndMeans', data);
    return res.data;
  }
};