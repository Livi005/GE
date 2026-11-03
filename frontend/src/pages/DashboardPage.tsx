import { useAuthStore } from '../store/authStore';
import AdminDashboard from './AdminDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import ProfessorDashboard from './ProfessorDashboard';
import StudentDashboard from './StudentDashboard';
import MaintenanceDashboard from './MaintenanceDashboard';
import YearHeadDashboard from './YearHeadDashboard'; 
import LoadingState from '../components/LoadingState';

export default function DashboardPage() {
  const { role } = useAuthStore();

  const dashboards: Record<string, React.ReactNode> = {
    'Director': <AdminDashboard />,
    'Secretary': <SecretaryDashboard />,
    'Professor': <ProfessorDashboard />,
    'Student': <StudentDashboard />,
    'Maintenance': <MaintenanceDashboard />, 
    'YearHead': <YearHeadDashboard />, 
  };

  return dashboards[role || ''] || <LoadingState message="Cargando..." />;
}