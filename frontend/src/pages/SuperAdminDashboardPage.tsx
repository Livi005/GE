import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ShieldCheck, Building2, Users, Activity, ArrowUpRight, MoreVertical } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/api/superadmin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Cargando control global..." />;
  if (error || !data) return <LoadingState message="No se pudo cargar la información global." isError />;

  const stats = [
    { title: 'Instituciones Activas', value: data.totalInstitutions, icon: Building2, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    { title: 'Usuarios Totales', value: data.totalUsers, icon: Users, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    { title: 'Uptime del Sistema', value: data.uptime, icon: Activity, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
  ];

  // Mapeo de Enum (Plan: 0=Trial, 1=Basic, 2=Premium)
  const getPlanName = (plan: number) => plan === 2 ? 'Premium' : plan === 1 ? 'Básico' : 'Prueba';
  const getStatusName = (status: number) => status === 0 ? 'Activo' : status === 1 ? 'Inactivo' : 'Suspendido';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-purple-600 dark:text-purple-400" size={32} /> Control Global
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Vista general de todas las instituciones en la plataforma.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Instituciones Registradas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                <th className="py-4 px-4 font-semibold">Institución</th>
                <th className="py-4 px-4 font-semibold">Dominio</th>
                <th className="py-4 px-4 font-semibold">Plan</th>
                <th className="py-4 px-4 font-semibold">Estado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.institutions.map((inst: any) => (
                <tr key={inst.idInstitution} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {inst.name.charAt(0)}
                    </div>
                    {inst.name}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{inst.domain}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${inst.plan === 2 ? 'bg-purple-100 text-purple-700' : inst.plan === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {getPlanName(inst.plan)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-2 text-xs font-bold ${inst.status === 0 ? 'text-green-600' : 'text-red-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${inst.status === 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {getStatusName(inst.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}