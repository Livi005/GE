import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Users, GraduationCap, BookOpen, DoorOpen, Bell, Calendar, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function AdminDashboard() {
  const { userName } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/api/dashboard/admin');
        setData(res.data);
      } catch (err) {
        console.error("Error cargando dashboard", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingState message="Cargando panel de control..." />;

  // Si falla, mostramos una estructura vacía en lugar de romper la pantalla
  const safeData = data || {
    totalStudents: 0,
    totalProfessors: 0,
    totalSubjects: 0,
    totalRooms: 0,
    weeklyAttendance: [
      { day: 'Lun', value: 0 }, { day: 'Mar', value: 0 }, { day: 'Mié', value: 0 }, { day: 'Jue', value: 0 }, { day: 'Vie', value: 0 }
    ],
    notifications: [],
    riskStudents: { high: 0, medium: 0, low: 0, total: 0 }
  };

  const stats = [
    { title: 'Estudiantes', value: safeData.totalStudents, icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { title: 'Profesores', value: safeData.totalProfessors, icon: GraduationCap, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { title: 'Asignaturas', value: safeData.totalSubjects, icon: BookOpen, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' },
    { title: 'Aulas', value: safeData.totalRooms, icon: DoorOpen, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Un gran día para aprender</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            ¡Hola, Director! <span className="text-4xl">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Aquí tienes un resumen de la información más importante de tu institución.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-xl text-sm">
          No se pudo conectar con el servidor para cargar las métricas. Mostrando datos vacíos.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}><stat.icon size={24} /></div>
            </div>
            <div><p className="text-3xl font-extrabold text-slate-800 dark:text-white">{stat.value}</p><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Bell size={20} className="text-purple-500"/> Notificaciones</h3>
          </div>
          <div className="space-y-4">
            {safeData.notifications.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-4">No hay notificaciones.</p>
            ) : safeData.notifications.slice(0, 4).map((n: any) => (
              <div key={n.id} className="flex gap-4 p-3 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><TrendingUp size={20} className="text-blue-500"/> Asistencia semanal</h3>
          </div>
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {safeData.weeklyAttendance.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.value}%</span>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative h-full flex items-end">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-purple-400 rounded-t-lg transition-all duration-1000" style={{ height: `${item.value}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}