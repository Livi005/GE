import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, Users, GraduationCap, BookOpen, CalendarDays, Settings, LogOut, Bell, Search, FileText, Library, Compass,
  ShieldCheck, Building2, ScrollText, UserCog, School, Monitor, Calendar, Building
} from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { role, logout, theme, isDean } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Fuerza la clase dark en el html para Tailwind
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleDisplayNames: Record<string, string> = {
    'SuperAdmin': 'Soporte Global',
    'Director': 'Director',
    'Maintenance': 'Gestor de Recursos',
    'Secretary': 'Secretaría',
    'Professor': 'Docente',
    'Student': 'Estudiante',
    'YearHead': 'Jefe de Año'
  };

  const menuItems = [
    // SUPERADMIN
    { name: 'Control Global', path: '/superadmin', icon: ShieldCheck, roles: ['SuperAdmin'] },
    { name: 'Instituciones', path: '/institutions', icon: Building2, roles: ['SuperAdmin'] },
    { name: 'Auditoría', path: '/audit', icon: ScrollText, roles: ['SuperAdmin'] },
    { name: 'Usuarios Globales', path: '/user-management', icon: UserCog, roles: ['SuperAdmin'] },

    // DIRECTOR
    { name: 'Inicio', path: '/dashboard', icon: Home, roles: ['Director'] },
    { name: 'Estudiantes', path: '/students', icon: Users, roles: ['Director'] },
    { name: 'Profesores', path: '/professors', icon: GraduationCap, roles: ['Director'] },
    { name: 'Cursos', path: '/courses', icon: BookOpen, roles: ['Director'] },
    { name: 'Asignaturas', path: '/subjects', icon: BookOpen, roles: ['Director'] },
    { name: 'Aulas', path: '/rooms', icon: School, roles: ['Director'] },
    { name: 'Medios', path: '/means', icon: Monitor, roles: ['Director'] },
    { name: 'Explorador', path: '/explorer', icon: Compass, roles: ['Director'] },

    // MAINTENANCE
    { name: 'Inicio', path: '/dashboard', icon: Home, roles: ['Maintenance'] },
    { name: 'Aulas', path: '/rooms', icon: School, roles: ['Maintenance'] },
    { name: 'Medios', path: '/means', icon: Monitor, roles: ['Maintenance'] },

    // SECRETARY
    { name: 'Inicio', path: '/dashboard', icon: Home, roles: ['Secretary'] },
    { name: 'Estudiantes', path: '/students', icon: Users, roles: ['Secretary'] },
    { name: 'Profesores', path: '/professors', icon: GraduationCap, roles: ['Secretary'] },
    { name: 'Cursos', path: '/courses', icon: BookOpen, roles: ['Secretary'] },
    { name: 'Asignaturas', path: '/subjects', icon: BookOpen, roles: ['Secretary'] },
    { name: 'Explorador', path: '/explorer', icon: Compass, roles: ['Secretary'] },

    // YEAR HEAD
    { name: 'Inicio', path: '/dashboard', icon: Home, roles: ['YearHead'] },
    { name: 'Cursos', path: '/courses', icon: BookOpen, roles: ['YearHead'] },
    { name: 'Asignaturas', path: '/subjects', icon: BookOpen, roles: ['YearHead'] },

    // PROFESSOR
    { name: 'Inicio', path: '/dashboard', icon: Home, roles: ['Professor'] },
    { name: 'Poner Notas', path: '/grades', icon: FileText, roles: ['Professor'] },
    { name: 'Asistencias', path: '/attendance', icon: CalendarDays, roles: ['Professor'] },
    { name: 'Mi Horario', path: '/prof-schedule', icon: Calendar, roles: ['Professor'] },
    { name: 'Reservar Aulas/Medios', path: '/reserve', icon: Building, roles: ['Professor'] },
    { name: 'Estudiantes', path: '/students', icon: Users, roles: ['Professor'] },

    // STUDENT
    { name: 'Inicio', path: '/dashboard', icon: Home, roles: ['Student'] },
    { name: 'Mis Notas', path: '/my-grades', icon: FileText, roles: ['Student'] },
    { name: 'Mi Horario', path: '/my-schedule', icon: Calendar, roles: ['Student'] },
    { name: 'Mis Profesores', path: '/my-professors', icon: GraduationCap, roles: ['Student'] },

    // COMPARTIDO
    { name: 'Configuración', path: '/settings', icon: Settings, roles: ['SuperAdmin', 'Director', 'Maintenance', 'Secretary', 'Professor', 'Student', 'YearHead'] },
  ];

  let allowedMenu = menuItems.filter(item => item.roles.includes(role || ''));

  if (role === 'Professor' && isDean) {
    allowedMenu.push({ name: 'Reportes de Facultad', path: '/faculty-reports', icon: FileText, roles: ['Professor'] });
  }
  
  return (
    <div 
      className={`min-h-screen flex relative bg-cover bg-center bg-no-repeat bg-fixed transition-colors duration-300 ${isDark ? 'dark' : ''}`}
      // Forzamos el cambio de fondo
      style={{ backgroundImage: isDark ? "url('/assets/fondo_gestion_oscuro.jpg')" : "url('/assets/fondo_gestion_claro.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-[1px] transition-colors duration-300"></div>

      <aside className="w-64 bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-r border-white/60 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col hidden md:flex z-20 transition-colors duration-300">
        <div className="h-28 flex items-center px-6 gap-4">
          <img src="/assets/flor.png" alt="Logo" className="w-16 h-16 object-contain drop-shadow-md" />
          <span className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">LYRA</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {allowedMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/90 dark:bg-white/10 shadow-md text-purple-800 dark:text-white font-bold border border-white dark:border-white/20' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white font-medium'}`}>
                <item.icon size={20} className={isActive ? 'text-purple-700 dark:text-purple-300' : 'text-slate-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/40 dark:border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 transition-colors font-bold">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        <header className="h-20 bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl border-b border-white/60 dark:border-white/10 flex items-center justify-between px-8 transition-colors duration-300">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-4 top-3 text-slate-500" size={18} />
            <input type="text" placeholder="Buscar..." className="w-full bg-white/80 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-white placeholder-slate-500 font-medium shadow-sm" />
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <Link to="/notifications" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </Link>
            <div className="flex items-center gap-3 border-l border-white/60 dark:border-white/10 pl-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">{role?.charAt(0)}</div>
              <div className="hidden md:block"><p className="text-sm font-bold text-slate-900 dark:text-white">{roleDisplayNames[role || ''] || role}</p></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}