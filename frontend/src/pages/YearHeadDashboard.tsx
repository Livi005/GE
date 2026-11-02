import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Calendar, BookOpen, Users, TrendingUp } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function YearHeadDashboard() {
  const { userName } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userName) return;
    // El Backend debe tener este endpoint (según tu informe)
    apiClient.get(`/api/dashboard/yearhead/${userName}`)
      .then(res => setData(res.data))
      .catch(err => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
  }, [userName]);

  if (loading) return <LoadingState message="Cargando panel de Jefe de Año..." />;
  if (error || !data) return <LoadingState message="No se pudo cargar la información." isError />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          ¡Hola, Jefe de Año! <span className="text-4xl">📚</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Resumen de la gestión académica del año.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-2xl flex items-center justify-center"><BookOpen size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-800 dark:text-white">{data.totalSubjects || 0}</p><p className="text-sm text-slate-600 dark:text-slate-400">Asignaturas</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 rounded-2xl flex items-center justify-center"><Users size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-800 dark:text-white">{data.totalStudents || 0}</p><p className="text-sm text-slate-600 dark:text-slate-400">Estudiantes</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400 rounded-2xl flex items-center justify-center"><TrendingUp size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-800 dark:text-white">{data.totalProfessors || 0}</p><p className="text-sm text-slate-600 dark:text-slate-400">Profesores</p></div>
        </div>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Calendar size={22} className="text-purple-500"/> Próximos Eventos</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-center py-4">No hay eventos próximos programados.</p>
      </div>
    </div>
  );
}