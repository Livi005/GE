import { useState, useEffect } from 'react';
import { ClassRoomService, ClassRoom } from '../services/classroom.service';
import { Plus, Edit2, Trash2, X, School } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function ClassRoomsPage() {
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [location, setLocation] = useState('');
  const [isAviable, setIsAviable] = useState(true);
  const [capacity, setCapacity] = useState(30);

  useEffect(() => { loadClassRooms(); }, []);

  const loadClassRooms = async () => {
    setLoading(true);
    setClassRooms(await ClassRoomService.getAll());
    setLoading(false);
  };

  const handleOpenModal = (room?: ClassRoom) => {
    if (room) {
      setEditingId(room.idClassR);
      setLocation(room.location);
      setIsAviable(room.isAviable);
      setCapacity((room as any).capacity || 30);
    } else {
      setEditingId(null);
      setLocation('');
      setIsAviable(true);
      setCapacity(30);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // AÑADIDO idInstitution: 1
    const payload = { location, isAviable, capacity, idInstitution: 1 };
    try {
      if (editingId) await ClassRoomService.update(editingId, payload);
      else await ClassRoomService.create(payload);
      setIsModalOpen(false);
      loadClassRooms();
    } catch (error) {
      alert("Error al guardar el aula.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta aula?')) {
      try {
        await ClassRoomService.delete(id);
        loadClassRooms();
      } catch {
        alert("Error al eliminar.");
      }
    }
  };

  if (loading) return <LoadingState message="Cargando aulas..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Aulas</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona los espacios físicos del centro.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-lyra px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Nueva Aula
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classRooms.map((room: any) => (
          <div key={room.idClassR} className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <School size={24} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(room)} className="p-2 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(room.idClassR)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{room.location}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Capacidad: {room.capacity || 30} alumnos</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.isAviable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {room.isAviable ? 'Disponible' : 'Ocupada'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">{editingId ? 'Editar Aula' : 'Nueva Aula'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Ubicación / Nombre</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/60 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. Planta 1 - Aula 3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Capacidad</label>
                <input type="number" required value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-white/60 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. 30" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" checked={isAviable} onChange={(e) => setIsAviable(e.target.checked)} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"/>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">¿Está disponible?</label>
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