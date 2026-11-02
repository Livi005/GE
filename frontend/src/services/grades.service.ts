import { apiClient } from '../api/client';

export const GradesService = {
  getMySubjects: async (userName: string) => {
    try {
      const res = await apiClient.get(`/professorStudentSubject/getsubjects?userName=${userName}`);
      return res.data?.value || res.data || [];
    } catch { return []; }
  },
  getStudentsBySubject: async (subjectId: number) => {
    try {
      const res = await apiClient.get(`/professorStudentSubject/getstudents?idSub=${subjectId}`);
      return res.data?.value || res.data || [];
    } catch { return []; }
  },
  getGradesByProfessor: async (userName: string) => {
    try {
      const res = await apiClient.get(`/professorStudentSubject/getnotesByProfessor?userName=${userName}`);
      return res.data?.value || res.data || [];
    } catch { return []; }
  },
  updateGrade: async (id: number, grade: number) => {
    return (await apiClient.put(`/professorStudentSubject/updateStudentNote?profStudSubId=${id}&studentGrade=${grade}`)).data;
  }
};