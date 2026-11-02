import { useAuthStore } from '../store/authStore';
import AdminDashboard from './AdminDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import ProfessorDashboard from './ProfessorDashboard';
import StudentDashboard from './StudentDashboard';
import LoadingState from '../components/LoadingState';

export default function DashboardPage() {
  const { role } = useAuthStore();

  // Mapeo robusto por rol
  const dashboards: Record<string, React.ReactNode> = {
    'Director': <AdminDashboard />,
    'Secretary': <SecretaryDashboard />,
    'Professor': <ProfessorDashboard />,
    'Student': <StudentDashboard />,
    'YearHead': <AdminDashboard />, // Por ahora usa el de Director
    'Maintenance': <AdminDashboard />, // Por ahora usa el de Director
  };

  return dashboards[role || ''] || <LoadingState message="Cargando..." />;
}