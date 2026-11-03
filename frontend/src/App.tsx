import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppLayout from './layouts/AppLayout';
import StudentsPage from './pages/StudentsPage';
import ProfessorsPage from './pages/ProfessorsPage';
import CoursesPage from './pages/CoursesPage';
import SubjectsPage from './pages/SubjectsPage';
import ClassRoomsPage from './pages/ClassRoomsPage';
import MeansPage from './pages/MeansPage';
import MyGradesPage from './pages/MyGradesPage';
import AttendancePage from './pages/AttendancePage';
import SettingsPage from './pages/SettingsPage';
import ExplorerPage from './pages/ExplorerPage';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import InstitutionsPage from './pages/InstitutionsPage';
import AuditPage from './pages/AuditPage';
import UserManagementPage from './pages/UserManagementPage';
import CreateStudentWizard from './pages/CreateStudentWizard';
import NotificationsPage from './pages/NotificationsPage';
import StudentGradesPage from './pages/StudentGradesPage';
import StudentSchedulePage from './pages/StudentSchedulePage';
import StudentProfessorsPage from './pages/StudentProfessorsPage';
import ProfessorSchedulePage from './pages/ProfessorSchedulePage';
import FacultyReportsPage from './pages/FacultyReportsPage'; // Ruta de Reportes
import ReservePage from './pages/ReservePage'; // Ruta de Reservas

// CORRECCIÓN AQUÍ: Ruta relativa "./store/authStore" en lugar de "../store/authStore"
import { useAuthStore } from './store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout><Navigate to="/dashboard" replace /></AppLayout></ProtectedRoute>} />
        
        {/* SUPERADMIN */}
        <Route path="/superadmin" element={<ProtectedRoute><AppLayout><SuperAdminDashboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/institutions" element={<ProtectedRoute><AppLayout><InstitutionsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AppLayout><AuditPage /></AppLayout></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute><AppLayout><UserManagementPage /></AppLayout></ProtectedRoute>} />

        {/* COMPARTIDO */}
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><AppLayout><StudentsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/students/create" element={<ProtectedRoute><AppLayout><CreateStudentWizard /></AppLayout></ProtectedRoute>} />
        <Route path="/professors" element={<ProtectedRoute><AppLayout><ProfessorsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><AppLayout><CoursesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><AppLayout><SubjectsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><AppLayout><ClassRoomsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/means" element={<ProtectedRoute><AppLayout><MeansPage /></AppLayout></ProtectedRoute>} />
        <Route path="/grades" element={<ProtectedRoute><AppLayout><MyGradesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AppLayout><AttendancePage /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/explorer" element={<ProtectedRoute><AppLayout><ExplorerPage /></AppLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />

        {/* ESTUDIANTE */}
        <Route path="/my-grades" element={<ProtectedRoute><AppLayout><StudentGradesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/my-schedule" element={<ProtectedRoute><AppLayout><StudentSchedulePage /></AppLayout></ProtectedRoute>} />
        <Route path="/my-professors" element={<ProtectedRoute><AppLayout><StudentProfessorsPage /></AppLayout></ProtectedRoute>} />

        {/* PROFESOR Y DECANO */}
        <Route path="/prof-schedule" element={<ProtectedRoute><AppLayout><ProfessorSchedulePage /></AppLayout></ProtectedRoute>} /> 
        <Route path="/faculty-reports" element={<ProtectedRoute><AppLayout><FacultyReportsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/reserve" element={<ProtectedRoute><AppLayout><ReservePage /></AppLayout></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;