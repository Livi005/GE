import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { UserPlus, FileText, CalendarClock, Bell, CheckCircle2 } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function SecretaryDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/dashboard/secretary');
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

  if (loading) return <LoadingState message="Cargando panel de secretaría..." />;
  if (error || !data) return <LoadingState message="No se pudo cargar la información." isError />;

  const stats = [
    { title: 'Nuevas Matrículas', value: data.newEnrollments, icon: UserPlus, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { title: 'Estudiantes Nuevos', value: data.newStudents, icon: FileText, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
    { title: 'Trámites Pendientes', value: data.pendingTrámites || 0, icon: CalendarClock, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          ¡Hola, Secretaría! <span className="text-4xl">📝</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Aquí tienes el resumen de las actividades administrativas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Bell size={20} className="text-purple-500"/> Avisos Recientes</h3>
          </div>
          <div className="space-y-4">
            {data.notifications?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No hay avisos recientes.</p>
            ) : data.notifications?.map((n: any) => (
              <div key={n.id} className="flex gap-4 p-3 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'Success' ? 'bg-green-100 text-green-600' : n.type === 'Warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><CalendarClock size={20} className="text-orange-500"/> Vencimientos Próximos</h3>
          </div>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
             <p>No hay trámites próximos a vencer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}