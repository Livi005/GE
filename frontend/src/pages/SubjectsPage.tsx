import { useState, useEffect } from 'react';
import { SubjectService, Subject } from '../services/subject.service';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [nameSub, setNameSub] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [courseLoad, setCourseLoad] = useState(10);
  const [idClassRoom, setIdClassRoom] = useState(1);

  useEffect(() => { loadSubjects(); }, []);

  const loadSubjects = async () => {
    setLoading(true);
    setSubjects(await SubjectService.getAll());
    setLoading(false);
  };

  const handleOpenModal = (sub?: Subject) => {
    if (sub) {
      setEditingId(sub.idSub);
      setNameSub(sub.nameSub);
      setStudyProgram(sub.studyProgram);
      setCourseLoad(sub.courseLoad);
      setIdClassRoom(sub.idClassRoom);
    } else {
      setEditingId(null);
      setNameSub('');
      setStudyProgram('');
      setCourseLoad(10);
      setIdClassRoom(1);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // AÑADIDO idInstitution: 1
    const payload = { 
      nameSub, 
      studyProgram, 
      courseLoad, 
      idClassRoom,
      idInstitution: 1
    };

    try {
      if (editingId) await SubjectService.update(editingId, payload);
      else await SubjectService.create(payload);
      setIsModalOpen(false);
      loadSubjects();
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.detail || "Error al guardar la asignatura.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta asignatura?')) {
      try {
        await SubjectService.delete(id);
        loadSubjects();
      } catch {
        alert("Error al eliminar.");
      }
    }
  };

  if (loading) return <LoadingState message="Cargando asignaturas..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Asignaturas</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona las materias del plan de estudios.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-lyra px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Nueva Asignatura
        </button>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-sm">
              <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Asignatura</th>
              <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Programa</th>
              <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Carga Horaria</th>
              <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Aula</th>
              <th className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">No hay asignaturas.</td></tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.idSub} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-white">{s.nameSub}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-200">{s.studyProgram}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-200">{s.courseLoad} hrs</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-200">{s.classRoomLocation || `Aula ID: ${s.idClassRoom}`}</td>
                  <td className="py-4 px-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(s.idSub)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 dark:text-white">{editingId ? 'Editar Asignatura' : 'Nueva Asignatura'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 dark:text-slate-300">Nombre</label>
                <input type="text" required value={nameSub} onChange={(e) => setNameSub(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" placeholder="Ej. Matemáticas" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 dark:text-slate-300">Programa de Estudio</label>
                <input type="text" required value={studyProgram} onChange={(e) => setStudyProgram(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" placeholder="Ej. Ciencias" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-slate-300">Carga (Hrs)</label>
                  <input type="number" required value={courseLoad} onChange={(e) => setCourseLoad(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-slate-300">ID del Aula</label>
                  <input type="number" required value={idClassRoom} onChange={(e) => setIdClassRoom(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white dark:border-slate-600" placeholder="1" />
                </div>
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