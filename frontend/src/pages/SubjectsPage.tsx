import { useState, useEffect } from 'react';
import { SubjectService, Subject } from '../services/subject.service';
import { ClassRoomService } from '../services/classroom.service';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function SubjectsPage() {
  const { institutionId } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classRooms, setClassRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [nameSub, setNameSub] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [courseLoad, setCourseLoad] = useState(1);
  const [idClassRoom, setIdClassRoom] = useState<number | ''>('');

  useEffect(() => { 
    loadData(); 
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, rooms] = await Promise.all([
        SubjectService.getAll(),
        ClassRoomService.getAll()
      ]);
      setSubjects(subs);
      setClassRooms(rooms);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      setCourseLoad(1);
      setIdClassRoom('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idClassRoom) {
      alert("Por favor, selecciona un aula.");
      return;
    }

    // El payload envía el idClassRoom REAL (número)
    const payload = { 
      nameSub, 
      studyProgram, 
      courseLoad, 
      idClassRoom: Number(idClassRoom), // Importante: convertir a número
      idInstitution: institutionId || 1
    };

    try {
      if (editingId) await SubjectService.update(editingId, payload);
      else await SubjectService.create(payload);
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta asignatura?')) {
      try {
        await SubjectService.delete(id);
        loadData();
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
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Asignaturas</h1>
          <p className="text-slate-700 dark:text-slate-400 font-medium">Gestiona las materias del plan de estudios.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-lyra px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Nueva Asignatura
        </button>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300 dark:border-slate-700 text-sm">
              <th className="py-4 px-4 font-bold text-slate-800 dark:text-slate-300">Asignatura</th>
              <th className="py-4 px-4 font-bold text-slate-800 dark:text-slate-300">Programa</th>
              <th className="py-4 px-4 font-bold text-slate-800 dark:text-slate-300">Carga (Hrs)</th>
              <th className="py-4 px-4 font-bold text-slate-800 dark:text-slate-300">Aula</th>
              <th className="py-4 px-4 font-bold text-slate-800 dark:text-slate-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.idSub} className="border-b border-slate-200 dark:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{s.nameSub}</td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{s.studyProgram}</td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{s.courseLoad} hrs</td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{s.classRoomLocation || `Aula ID: ${s.idClassRoom}`}</td>
                <td className="py-4 px-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg dark:bg-slate-800 dark:text-blue-400"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(s.idSub)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg dark:bg-slate-800 dark:text-red-400"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative bg-white/90 dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white">{editingId ? 'Editar Asignatura' : 'Nueva Asignatura'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-300">Nombre</label>
                <input type="text" required value={nameSub} onChange={(e) => setNameSub(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" placeholder="Ej. Matemáticas" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-300">Programa de Estudio</label>
                <input type="text" required value={studyProgram} onChange={(e) => setStudyProgram(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" placeholder="Ej. Ciencias" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-300">Carga (Hrs)</label>
                  <input type="number" min="1" required value={courseLoad} onChange={(e) => setCourseLoad(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-300">Aula</label>
                  <select required value={idClassRoom} onChange={(e) => setIdClassRoom(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium">
                    <option value="">Selecciona un Aula</option>
                    {classRooms.map((room: any) => (
                      <option key={room.idClassR} value={room.idClassR}>{room.location}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-700 font-bold bg-slate-200 hover:bg-slate-300 transition-colors">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}