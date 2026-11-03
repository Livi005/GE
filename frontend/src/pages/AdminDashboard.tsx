import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Users, GraduationCap, BookOpen, DoorOpen, Bell, Calendar, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/dashboard/admin');
        setData(res.data);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingState message="Cargando panel de control..." />;
  if (error) return <LoadingState message="No se pudo cargar la información del servidor." isError />;

  const safeData = data || {
    totalStudents: 0,
    totalProfessors: 0,
    totalSubjects: 0,
    totalRooms: 0,
    weeklyAttendance: [],
    notifications: [],
    riskStudents: { high: 0, medium: 0, low: 0, total: 0 }
  };

  const stats = [
    { title: 'Estudiantes', value: safeData.totalStudents, icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { title: 'Profesores', value: safeData.totalProfessors, icon: GraduationCap, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { title: 'Asignaturas', value: safeData.totalSubjects, icon: BookOpen, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' },
    { title: 'Aulas', value: safeData.totalRooms, icon: DoorOpen, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
  ];

  // Calcular total de alumnos en riesgo para el gráfico
  const totalRisk = safeData.riskStudents.total || 1; // Evitar división por 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-1">Un gran día para aprender</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            ¡Hola, Director! <span className="text-4xl">👋</span>
          </h1>
          <p className="text-slate-700 dark:text-slate-400 mt-2">Aquí tienes un resumen de la información más importante de tu institución.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}><stat.icon size={24} /></div>
            </div>
            <div><p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">{stat.title}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificaciones */}
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Bell size={20} className="text-purple-600"/> Notificaciones Recientes</h3>
          </div>
          <div className="space-y-4">
            {safeData.notifications.length === 0 ? (
               <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No hay notificaciones.</p>
            ) : safeData.notifications.slice(0, 4).map((n: any) => (
              <div key={n.id} className="flex gap-4 p-3 bg-white/50 dark:bg-slate-700/50 rounded-xl transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-700`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asistencia Semanal */}
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Asistencia semanal</h3>
          </div>
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {safeData.weeklyAttendance.length === 0 ? (
               <p className="text-sm text-slate-600 dark:text-slate-400 w-full text-center">Sin datos de asistencia.</p>
            ) : safeData.weeklyAttendance.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-300">{item.value}%</span>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg relative h-full flex items-end">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-lg transition-all duration-1000" style={{ height: `${item.value}%` }}></div>
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-400 font-bold">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alumnos en Riesgo */}
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><AlertTriangle size={20} className="text-orange-500"/> Alumnos en riesgo</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Gráfico de Dona Dinámico */}
            <div className="relative w-40 h-40 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="4"></circle>
                {safeData.riskStudents.high > 0 && (
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-pink-500" strokeWidth="4" strokeDasharray={`${(safeData.riskStudents.high / totalRisk) * 100} 100`} strokeDashoffset="0"></circle>
                )}
                {safeData.riskStudents.medium > 0 && (
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-purple-500" strokeWidth="4" strokeDasharray={`${(safeData.riskStudents.medium / totalRisk) * 100} 100`} strokeDashoffset={`-${(safeData.riskStudents.high / totalRisk) * 100}`}></circle>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{safeData.riskStudents.total}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 text-center leading-tight font-bold">estudiantes<br/>en riesgo</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold"><span className="w-3 h-3 rounded-full bg-pink-500"></span> Riesgo alto</span>
                <span className="font-bold text-slate-900 dark:text-white">{safeData.riskStudents.high}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Riesgo medio</span>
                <span className="font-bold text-slate-900 dark:text-white">{safeData.riskStudents.medium}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold"><span className="w-3 h-3 rounded-full bg-slate-300"></span> Riesgo bajo</span>
                <span className="font-bold text-slate-900 dark:text-white">{safeData.riskStudents.low}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Eventos (Placeholder hasta que el back envíe events) */}
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Calendar size={20} className="text-pink-600"/> Próximos eventos</h3>
          </div>
          <div className="text-center py-8 text-slate-600 dark:text-slate-400 font-medium">
            <p>No hay eventos próximos programados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}