import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ScrollText, Search, Filter, ShieldAlert, CheckCircle2, User, Clock } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/superadmin/audit-logs?search=${searchTerm}&type=${filterType === 'all' ? '' : filterType}`);
        setLogs(res.data?.value || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    // Debounce simple
    const timer = setTimeout(fetchLogs, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterType]);

  const getTypeStyles = (type: number) => {
    switch (type) {
      case 1: return { icon: CheckCircle2, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' };
      case 2: return { icon: ShieldAlert, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' };
      case 3: return { icon: ShieldAlert, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' };
      default: return { icon: Clock, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
    }
  };

  if (loading && logs.length === 0) return <LoadingState message="Cargando auditoría..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <ScrollText className="text-purple-600 dark:text-purple-400" size={32} /> Auditoría del Sistema
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Registro histórico de todas las acciones realizadas.</p>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input type="text" placeholder="Buscar por usuario o detalle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/60 dark:bg-slate-700/50 border rounded-xl pl-12 pr-4 py-3 focus:outline-none dark:text-white" />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-3 text-slate-400" size={20} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full md:w-64 bg-white/60 dark:bg-slate-700/50 border rounded-xl pl-12 pr-10 py-3 focus:outline-none dark:text-white appearance-none">
              <option value="all">Todos los tipos</option>
              <option value="0">Información</option>
              <option value="1">Éxito</option>
              <option value="2">Advertencia</option>
              <option value="3">Crítico</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                <th className="py-4 px-4 font-semibold">Tipo</th>
                <th className="py-4 px-4 font-semibold">Usuario</th>
                <th className="py-4 px-4 font-semibold">Acción</th>
                <th className="py-4 px-4 font-semibold">Detalles</th>
                <th className="py-4 px-4 font-semibold">IP</th>
                <th className="py-4 px-4 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const TypeIcon = getTypeStyles(log.type).icon;
                return (
                  <tr key={log.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeStyles(log.type).color}`}><TypeIcon size={16} /></div></td>
                    <td className="py-4 px-4 font-medium text-slate-800 dark:text-white flex items-center gap-2"><User size={14} className="text-slate-400" /> {log.userName}</td>
                    <td className="py-4 px-4 text-xs font-bold text-slate-600 dark:text-slate-300">{log.action}</td>
                    <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300">{log.details}</td>
                    <td className="py-4 px-4 text-sm text-slate-500 font-mono">{log.ipAddress}</td>
                    <td className="py-4 px-4 text-sm text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}