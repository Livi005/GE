import { useState, useEffect } from 'react';
import { ProfessorService, Professor } from '../services/professor.service';
import { Search, Plus, Edit2, Trash2, X, Download } from 'lucide-react';
import Pagination from '../components/Pagination';
import { exportToCsv } from '../utils/exportToCsv';
import LoadingState from '../components/LoadingState';

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    nameProf: '', contract: 'Tiempo Completo', spec: '', salary: 1500, isDean: false, laboralExperience: 0, useAuxMean: false, idInstitution: 1 
  });

  useEffect(() => { loadProfessors(); }, []);

  const loadProfessors = async () => {
    setLoading(true);
    setProfessors(await ProfessorService.getAll());
    setLoading(false);
  };

  const handleOpenModal = (prof?: Professor) => {
    if (prof) {
      setEditingId(prof.id);
      setFormData({
        nameProf: prof.professor.nameProf,
        contract: prof.professor.contract,
        spec: prof.professor.spec,
        salary: prof.professor.salary,
        isDean: prof.professor.isDean,
        laboralExperience: prof.professor.laboralExperience,
        useAuxMean: prof.professor.useAuxMean,
        idInstitution: 1 
      });
    } else {
      setEditingId(null);
      setFormData({ nameProf: '', contract: 'Tiempo Completo', spec: '', salary: 1500, isDean: false, laboralExperience: 0, useAuxMean: false, idInstitution: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Payload exacto para el Backend
      const payload = {
        nameProf: formData.nameProf,
        contract: formData.contract,
        spec: formData.spec,
        salary: formData.salary,
        isDean: formData.isDean,
        laboralExperience: formData.laboralExperience,
        useAuxMean: formData.useAuxMean,
        idInstitution: 1 
      };

      if (editingId) await ProfessorService.update(editingId, payload);
      else await ProfessorService.create(payload);
      
      setIsModalOpen(false);
      loadProfessors();
    } catch (error: any) { 
      console.error(error.response?.data);
      alert(error.response?.data?.detail || "Error al guardar profesor. Revisa la consola."); 
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar a este profesor?')) {
      await ProfessorService.delete(id);
      loadProfessors();
    }
  };

  const handleExport = () => {
    const dataToExport = filtered.map(p => ({
      Nombre: p.professor.nameProf,
      Especialidad: p.professor.spec,
      Salario: p.professor.salary,
      Decano: p.professor.isDean ? 'Sí' : 'No'
    }));
    exportToCsv('profesores', dataToExport);
  };

  const filtered = professors.filter(p => p.professor?.nameProf?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingState message="Cargando profesores..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Profesores</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona el claustro de profesores del centro.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-3 bg-white/50 border rounded-xl flex items-center gap-2 dark:bg-slate-800/50 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors dark:text-white"><Download size={18} /> Exportar</button>
          <button onClick={() => handleOpenModal()} className="btn-lyra px-6 py-3 flex items-center gap-2"><Plus size={20} /> Nuevo Profesor</button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-white/60 dark:bg-slate-700/50 border rounded-xl pl-12 pr-4 py-3 focus:outline-none dark:text-white" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm">
                <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Nombre</th>
                <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Especialidad</th>
                <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Salario</th>
                <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Rol</th>
                <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-white">{p.professor?.nameProf}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-200">{p.professor?.spec}</td>
                  <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-200">${p.professor?.salary}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.professor?.isDean ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'}`}>
                      {p.professor?.isDean ? 'Decano' : 'Profesor'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 dark:text-white">{editingId ? 'Editar Profesor' : 'Nuevo Profesor'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Nombre</label><input type="text" required value={formData.nameProf} onChange={(e) => setFormData({...formData, nameProf: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" placeholder="Ej. Juan Gómez" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-slate-300">Especialidad</label>
                  <select required value={formData.spec} onChange={(e) => setFormData({...formData, spec: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600">
                    <option value="">Seleccionar...</option>
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Física">Física</option>
                    <option value="Química">Química</option>
                    <option value="Biología">Biología</option>
                    <option value="Historia">Historia</option>
                    <option value="Geografía">Geografía</option>
                    <option value="Lengua y Literatura">Lengua y Literatura</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Educación Física">Educación Física</option>
                    <option value="Artes">Artes</option>
                    <option value="Informática">Informática</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Salario</label><input type="number" required value={formData.salary} onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" /></div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" checked={formData.isDean} onChange={(e) => setFormData({...formData, isDean: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
                <label className="text-sm font-medium dark:text-slate-300">¿Es Decano?</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-white/50 dark:hover:bg-slate-700/50">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}