import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { it, expect, vi } from 'vitest';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import DashboardPage from '../pages/DashboardPage';

const data = {
  studentName: 'Vivi Test', courseName: 'Curso prueba', averageGrade: 8.5,
  grades: [], schedule: [], professors: [], attendancePercentage: 95,
  totalStudents: 23, totalProfessors: 4, totalSubjects: 5, totalRooms: 6,
  notifications: [], events: [], weeklyAttendance: [],
  riskStudents: { high: 0, medium: 0, low: 0, total: 0 },
  todayClasses: [], pendingGrades: 2, newEnrollments: 3,
  upcomingDeadlines: [], totalActiveStudents: 23,
};
it.each([
  ['Director', '/dashboard/admin', /Hola, Director/],
  ['Secretary', '/dashboard/secretary', /Hola/],
  ['Professor', '/dashboard/professor/vivi.test', /Hola, Profe/],
  ['Student', '/dashboard/student/vivi.test', /Hola, Vivi Test/],
])('el rol %s abre su panel y consulta su endpoint', async (role, path, heading) => {
  useAuthStore.setState({ role, userName: 'vivi.test', token: 'test-token' });
  const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data });
  render(<MemoryRouter><DashboardPage /></MemoryRouter>);
  expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeVisible();
  expect(get).toHaveBeenCalledWith(path);
});
it('un fallo del panel Director no se presenta como datos reales', async () => {
  useAuthStore.setState({ role: 'Director', userName: 'vivi.test', token: 'test-token' });
  vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('sin conexión'));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<MemoryRouter><DashboardPage /></MemoryRouter>);
  expect(await screen.findByText('No se pudo cargar la información del servidor.')).toBeVisible();
  expect(screen.queryByRole('heading', { name: /Hola, Director/ })).not.toBeInTheDocument();
});
