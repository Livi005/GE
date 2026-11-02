import { useState, useEffect } from 'react';
import { MeansService, Means } from '../services/means.service';
import { Plus, Edit2, Trash2, X, Monitor, BookOpen, Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import LoadingState from '../components/LoadingState';

export default function MeansPage() {
  const [activeTab, setActiveTab] = useState<'tech' | 'aux'>('tech');
  const [means, setMeans] = useState<Means[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameMean, setNameMean] = useState('');
  const [state, setState] = useState('Bueno');
  const [isAviable, setIsAviable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [type, setType] = useState('');

  useEffect(() => {
    loadMeans();
    setCurrentPage(1);
  }, [activeTab]);

  const loadMeans = async () => {
    setLoading(true);
    if (activeTab === 'tech') setMeans(await MeansService.getTechnological());
    else setMeans(await MeansService.getAuxiliary());
    setLoading(false);
  };

  const handleOpenModal = (mean?: Means) => {
    if (mean) {
      setEditingId(mean.idMean);
      setNameMean(mean.nameMean);
      setState(mean.state);
      setIsAviable(mean.isAviable);
      setIsActive((mean as any).isActive !== undefined ? (mean as any).isActive : true);
      setType(mean.type || '');
    } else {
      setEditingId(null);
      setNameMean('');
      setState('Bueno');
      setIsAviable(true);
      setIsActive(true);
      setType('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // AÑADIDO idInstitution: 1
    const payload: any = { 
      nameMean, 
      state, 
      isAviable, 
      isActive,
      idInstitution: 1
    };
    
    if (activeTab === 'aux') {
      payload.type = type;
    }

    try {
      if (activeTab === 'tech') {
        if (editingId) await MeansService.updateTechnological(editingId, payload);
        else await MeansService.createTechnological(payload);
      } else {
        if (editingId) await MeansService.updateAuxiliary(editingId, payload);
        else await MeansService.createAuxiliary(payload);
      }
      setIsModalOpen(false);
      loadMeans();
    } catch (error: any) { 
      console.error(error.response?.data);
      alert(error.response?.data?.detail || "Error al guardar el medio. Revisa la consola."); 
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este medio?')) {
      try {
        if (activeTab === 'tech') await MeansService.deleteTechnological(id);
        else await MeansService.deleteAuxiliary(id);
        loadMeans(); // Recargar la lista
      } catch (error: any) {
        alert("Error al eliminar: " + (error.response?.data?.detail || "Revisa la consola"));
      }
    }
  };

  const filtered = means.filter(m => m.nameMean.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Medios y Recursos</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona los equipos y materiales del centro.</p>
        </div>
        
        <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl backdrop-blur-md border dark:border-slate-700">
          <button onClick={() => setActiveTab('tech')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'tech' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}>
            <Monitor size={18} /> Tecnológicos
          </button>
          <button onClick={() => setActiveTab('aux')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'aux' ? 'bg-white dark:bg-slate-700 shadow-sm text-pink-600' : 'text-slate-500'}`}>
            <BookOpen size={18} /> Auxiliares
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar medio..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-white/60 dark:bg-slate-700/50 border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none dark:text-white" />
          </div>
          <button onClick={() => handleOpenModal()} className="btn-lyra px-4 py-2 flex items-center gap-2 text-sm"><Plus size={18} /> Añadir Medio</button>
        </div>

        {loading ? <LoadingState message="Cargando medios..." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm">
                  <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Nombre</th>
                  {activeTab === 'aux' && <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Tipo</th>}
                  <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Estado</th>
                  <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Disponibilidad</th>
                  <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((m) => (
                  <tr key={m.idMean} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-800 dark:text-white">{m.nameMean}</td>
                    {activeTab === 'aux' && <td className="py-4 px-4 text-slate-600 dark:text-slate-200">{m.type}</td>}
                    <td className="py-4 px-4 capitalize text-slate-600 dark:text-slate-200">{m.state}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.isAviable ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'}`}>
                        {m.isAviable ? 'Disponible' : 'Ocupado'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(m)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(m.idMean)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 dark:text-white">{editingId ? 'Editar' : 'Nuevo'} {activeTab === 'tech' ? 'Tecnológico' : 'Auxiliar'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Nombre</label><input type="text" required value={nameMean} onChange={(e) => setNameMean(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" /></div>
              {activeTab === 'aux' && <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Tipo</label><input type="text" required value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" /></div>}
              <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Estado Físico</label><select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600"><option value="Bueno">Bueno</option><option value="Regular">Regular</option><option value="Malo">Malo</option></select></div>
              <div className="flex items-center gap-3 pt-2"><input type="checkbox" checked={isAviable} onChange={(e) => setIsAviable(e.target.checked)} className="w-5 h-5 text-purple-600 rounded" /><label className="text-sm font-medium dark:text-slate-300">¿Está disponible?</label></div>
              <div className="flex items-center gap-3 pt-2"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-5 h-5 text-purple-600 rounded" /><label className="text-sm font-medium dark:text-slate-300">¿Está activo en el sistema?</label></div>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-white/50 dark:hover:bg-slate-700/50">Cancelar</button><button type="submit" className="btn-lyra px-6 py-2">Guardar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}