import { apiClient } from '../api/client';

export const DashboardService = {
  getStudentData: async (userName: string) => {
    try {
      const res = await apiClient.get(`/dashboard/student/${userName}`);
      return res.data.value || res.data;
    } catch (e) { return null; }
  },
  getProfessorData: async (userName: string) => {
    try {
      const res = await apiClient.get(`/dashboard/professor/${userName}`);
      return res.data.value || res.data;
    } catch (e) { return { totalSubjects: 0, totalStudents: 0, pendingGrades: 0 }; }
  }
};