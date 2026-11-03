import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { School, Monitor, CheckCircle2, AlertTriangle, Wrench } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function MaintenanceDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient.get('/dashboard/maintenance')
      .then(res => setData(res.data))
      .catch(err => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Cargando panel de mantenimiento..." />;
  if (error || !data) return <LoadingState message="No se pudo cargar la información." isError />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          ¡Hola, Mantenimiento! <span className="text-4xl">🛠️</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-400 mt-2 font-medium">Resumen de aulas y medios del centro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center"><School size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data.totalClassRooms || 0}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Aulas Totales</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center"><Monitor size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{(data.totalTechMeans || 0) + (data.totalAuxMeans || 0)}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Medios Totales</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center"><Wrench size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data.pendingMaintenances || 0}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Mantenimientos Pendientes</p></div>
        </div>
      </div>
      
      <div className="glass-card p-6">
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Estado de los Medios</h3>
         <p className="text-slate-600 dark:text-slate-400 font-medium">No hay reportes de daños recientes.</p>
      </div>
    </div>
  );
}
