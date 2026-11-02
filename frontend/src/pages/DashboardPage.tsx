import { useAuthStore } from '../store/authStore';
import AdminDashboard from './AdminDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import ProfessorDashboard from './ProfessorDashboard';
import StudentDashboard from './StudentDashboard';
import MaintenanceDashboard from './MaintenanceDashboard'; // NUEVO
import YearHeadDashboard from './YearHeadDashboard'; // NUEVO
import LoadingState from '../components/LoadingState';

export default function DashboardPage() {
  const { role } = useAuthStore();

  const dashboards: Record<string, React.ReactNode> = {
    'Director': <AdminDashboard />,
    'Secretary': <SecretaryDashboard />,
    'Professor': <ProfessorDashboard />,
    'Student': <StudentDashboard />,
    'Maintenance': <MaintenanceDashboard />, // NUEVO
    'YearHead': <YearHeadDashboard />, // NUEVO
  };

  return dashboards[role || ''] || <LoadingState message="Cargando..." />;
}