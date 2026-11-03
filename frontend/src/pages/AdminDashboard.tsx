import { useState, useEffect } from 'react';
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
    totalStudents: 0, totalProfessors: 0, totalSubjects: 0, totalRooms: 0,
    weeklyAttendance: [], notifications: [], riskStudents: { high: 0, medium: 0, low: 0, total: 0 }
  };

  const stats = [
    { title: 'Estudiantes', value: safeData.totalStudents, icon: Users, color: 'text-blue-800 bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400' },
    { title: 'Profesores', value: safeData.totalProfessors, icon: GraduationCap, color: 'text-purple-800 bg-purple-200 dark:bg-purple-900/50 dark:text-purple-400' },
    { title: 'Asignaturas', value: safeData.totalSubjects, icon: BookOpen, color: 'text-pink-800 bg-pink-200 dark:bg-pink-900/50 dark:text-pink-400' },
    { title: 'Aulas', value: safeData.totalRooms, icon: DoorOpen, color: 'text-green-800 bg-green-200 dark:bg-green-900/50 dark:text-green-400' },
  ];

  const totalRisk = safeData.riskStudents.total || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-1">Un gran día para aprender</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            ¡Hola, Director! <span className="text-4xl">👋</span>
          </h1>
          <p className="text-slate-800 dark:text-slate-400 mt-2 font-bold">Aquí tienes un resumen de la información de tu institución.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 relative overflow-hidden group bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}><stat.icon size={24} /></div>
            </div>
            <div><p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p><p className="text-sm text-slate-800 dark:text-slate-300 font-bold">{stat.title}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificaciones */}
        <div className="glass-card p-6 bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Bell size={20} className="text-purple-700"/> Notificaciones Recientes</h3>
          </div>
          <div className="space-y-4">
            {safeData.notifications.length === 0 ? (
               <p className="text-sm text-slate-700 dark:text-slate-400 text-center py-4 font-bold">No hay notificaciones.</p>
            ) : safeData.notifications.slice(0, 4).map((n: any) => (
              <div key={n.id} className="flex gap-4 p-3 bg-white/90 dark:bg-slate-700/50 rounded-xl transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-200 text-blue-800`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-800 dark:text-slate-300 mt-0.5 line-clamp-2 font-semibold">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asistencia Semanal */}
        <div className="glass-card p-6 bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp size={20} className="text-blue-700"/> Asistencia semanal</h3>
          </div>
          
          <div className="relative h-48 w-full flex flex-col justify-end">
            {safeData.weeklyAttendance.length === 0 ? (
               <p className="text-sm text-slate-700 dark:text-slate-400 w-full text-center mb-10 font-bold">Sin datos.</p>
            ) : (
              <>
                <svg viewBox="0 0 100 40" className="w-full h-40 overflow-visible" preserveAspectRatio="none">
                  <line x1="0" y1="35" x2="100" y2="35" stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="0.5" />
                  {safeData.weeklyAttendance.map((item: any, i: number) => {
                      const x = (i / (safeData.weeklyAttendance.length - 1 || 1)) * 100;
                      const y = 35 - (item.value * 0.35); 
                      return (
                        <g key={i}>
                           {i > 0 && (
                             <line 
                               x1={((i-1) / (safeData.weeklyAttendance.length - 1 || 1)) * 100} 
                               y1={35 - (safeData.weeklyAttendance[i-1].value * 0.35)} 
                               x2={x} y2={y} stroke="url(#gradient)" strokeWidth="2" 
                             />
                           )}
                           <circle cx={x} cy={y} r="2" fill="#6D28D9" /> 
                        </g>
                      );
                  })}
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between w-full mt-2">
                  {safeData.weeklyAttendance.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white bg-white/50 dark:bg-slate-700 px-1 rounded">{item.value}%</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-400 mt-1">{item.day}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alumnos en Riesgo */}
        <div className="glass-card p-6 bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><AlertTriangle size={20} className="text-orange-600"/> Alumnos en riesgo</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="4"></circle>
                {safeData.riskStudents.high > 0 && (
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-pink-500" strokeWidth="4" strokeDasharray={`${(safeData.riskStudents.high / totalRisk) * 100} 100`} strokeDashoffset="0"></circle>
                )}
                {safeData.riskStudents.medium > 0 && (
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-purple-500" strokeWidth="4" strokeDasharray={`${(safeData.riskStudents.medium / totalRisk) * 100} 100`} strokeDashoffset={`-${(safeData.riskStudents.high / totalRisk) * 100}`}></circle>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{safeData.riskStudents.total}</span>
                <span className="text-[10px] text-slate-800 dark:text-slate-400 text-center leading-tight font-bold">estudiantes<br/>en riesgo</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex justify-between items-center text-sm bg-white/60 dark:bg-slate-700/50 p-2 rounded-lg">
                <span className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold"><span className="w-3 h-3 rounded-full bg-pink-500"></span> Riesgo alto</span>
                <span className="font-bold text-slate-900 dark:text-white">{safeData.riskStudents.high}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-white/60 dark:bg-slate-700/50 p-2 rounded-lg">
                <span className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Riesgo medio</span>
                <span className="font-bold text-slate-900 dark:text-white">{safeData.riskStudents.medium}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-white/60 dark:bg-slate-700/50 p-2 rounded-lg">
                <span className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold"><span className="w-3 h-3 rounded-full bg-slate-400"></span> Riesgo bajo</span>
                <span className="font-bold text-slate-900 dark:text-white">{safeData.riskStudents.low}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Calendar size={20} className="text-pink-600"/> Próximos eventos</h3>
          </div>
          <div className="text-center py-8 text-slate-700 dark:text-slate-400 font-bold bg-white/40 dark:bg-slate-800/40 rounded-xl">
            <p>No hay eventos próximos programados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}