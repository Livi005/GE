import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Building2, Search, Plus, MoreVertical, Globe, Mail, Phone, Users, Edit2, Trash2, X } from 'lucide-react';
import Pagination from '../components/Pagination';
import LoadingState from '../components/LoadingState';

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', domain: '', email: '', phone: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/institutions');
      setInstitutions(res.data?.value || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (inst?: any) => {
    if (inst) {
      setEditingId(inst.idInstitution);
      setFormData({ name: inst.name, domain: inst.domain, email: inst.email || '', phone: inst.phone || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', domain: '', email: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await apiClient.put(`/api/institutions/${editingId}`, formData);
      else await apiClient.post('/api/institutions', formData);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert("Error al guardar institución.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta institución? Esto borrará todos sus datos asociados.')) {
      try {
        await apiClient.delete(`/api/institutions/${id}`);
        loadData();
      } catch (err) {
        alert("Error al eliminar.");
      }
    }
  };

  const getPlanName = (plan: number) => plan === 2 ? 'Premium' : plan === 1 ? 'Básico' : 'Prueba';
  const getPlanColor = (plan: number) => plan === 2 ? 'bg-purple-100 text-purple-700' : plan === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600';
  const getStatusName = (status: number) => status === 0 ? 'Activo' : status === 1 ? 'Inactivo' : 'Suspendido';

  const filtered = institutions.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || getPlanName(i.plan).toLowerCase() === filterPlan.toLowerCase();
    return matchesSearch && matchesPlan;
  });
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingState message="Cargando instituciones..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Building2 className="text-blue-600 dark:text-blue-400" size={32} /> Instituciones
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona los colegios en la plataforma.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-lyra px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Nueva Institución
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Buscar por nombre o dominio..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-white/60 dark:bg-slate-700/50 border rounded-xl pl-12 pr-4 py-3 focus:outline-none dark:text-white" />
        </div>
        <select value={filterPlan} onChange={(e) => { setFilterPlan(e.target.value); setCurrentPage(1); }} className="px-4 py-3 bg-white/60 dark:bg-slate-700/50 border rounded-xl focus:outline-none dark:text-white min-w-[150px]">
          <option value="all">Todos los planes</option>
          <option value="Premium">Premium</option>
          <option value="Básico">Básico</option>
          <option value="Prueba">Prueba</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentData.map((inst) => (
          <div key={inst.idInstitution} className="bg-white/60 dark:bg-slate-700/50 p-6 rounded-2xl border border-white/80 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{inst.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold mt-1 ${getPlanColor(inst.plan)}`}>
                    Plan {getPlanName(inst.plan)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(inst)} className="p-2 text-slate-400 hover:text-blue-500 rounded-lg"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(inst.idInstitution)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2"><Globe size={16} className="text-slate-400" /> {inst.domain}</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-slate-400" /> {inst.email || 'No registrado'}</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-slate-400" /> {inst.phone || 'No registrado'}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600 flex justify-between items-center">
              <span className={`flex items-center gap-2 text-xs font-bold ${inst.status === 0 ? 'text-green-600' : 'text-red-500'}`}>
                <span className={`w-2 h-2 rounded-full ${inst.status === 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {getStatusName(inst.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">{editingId ? 'Editar Institución' : 'Nueva Institución'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-bold mb-1">Nombre</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" /></div>
              <div><label className="block text-sm font-bold mb-1">Dominio</label><input type="text" required value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" /></div>
              <div><label className="block text-sm font-bold mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" /></div>
              <div><label className="block text-sm font-bold mb-1">Teléfono</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-600 font-semibold">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}