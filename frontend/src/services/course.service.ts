import { apiClient } from '../api/client';

export interface Course {
  idC: number;
  courseName: string;
}

export const CourseService = {
  getAll: async (): Promise<Course[]> => {
    try {
      const res = await apiClient.get('/course/list');
      return res.data?.value || res.data || [];
    } catch (error: any) {
      console.error("Error cargando cursos:", error.response?.data?.detail || error.message);
      throw error;
    }
  }
};