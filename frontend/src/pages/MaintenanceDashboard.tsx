import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { School, Monitor, CheckCircle2, AlertTriangle } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function MaintenanceDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient.get('/api/dashboard/maintenance')
      .then(res => setData(res.data))
      .catch(err => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Cargando panel de mantenimiento..." />;
  if (error || !data) return <LoadingState message="No se pudo cargar la información." isError />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          ¡Hola, Mantenimiento! <span className="text-4xl">🛠️</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Resumen de aulas y medios del centro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-2xl flex items-center justify-center"><School size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-800 dark:text-white">{data.totalClassRooms || 0}</p><p className="text-sm text-slate-600 dark:text-slate-400">Aulas Totales</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 rounded-2xl flex items-center justify-center"><Monitor size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-800 dark:text-white">{data.totalMeans || 0}</p><p className="text-sm text-slate-600 dark:text-slate-400">Medios Totales</p></div>
        </div>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Aulas en Mal Estado</h3>
        <p className="text-slate-500 dark:text-slate-400">No hay aulas reportadas en mal estado.</p>
      </div>
    </div>
  );
}