import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentService, Student } from '../services/student.service';
import { Search, Plus, Edit2, Trash2, Download, Eye, X } from 'lucide-react';
import Pagination from '../components/Pagination';
import { exportToCsv } from '../utils/exportToCsv';
import LoadingState from '../components/LoadingState';

export default function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Para el modal de ver
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    setLoading(true);
    const data = await StudentService.getAll();
    setStudents(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar a este estudiante?')) {
      try {
        await StudentService.delete(id);
        loadStudents();
      } catch (err) {
        alert("Error al eliminar estudiante.");
      }
    }
  };

  const handleExport = () => {
    const dataToExport = filtered.map(s => ({
      ID: s.id,
      Nombre: `${s.student?.name1} ${s.student?.lastName1}`,
      Email: s.student?.email,
      Curso: s.student?.grade,
      Estado: s.student?.isActive ? 'Activo' : 'Inactivo'
    }));
    exportToCsv('estudiantes', dataToExport);
  };

  const filtered = students.filter(s => {
    const name = s.student?.name1 || '';
    const lastName = s.student?.lastName1 || '';
    const doc = s.student?.docNumber || '';
    return `${name} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || doc.includes(searchTerm);
  });
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingState message="Cargando estudiantes..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Estudiantes</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona la lista de alumnos del centro.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors font-semibold">
            <Download size={18} /> Exportar
          </button>
          <button onClick={() => navigate('/students/create')} className="btn-lyra px-6 py-3 flex items-center gap-2">
            <Plus size={20} /> Nuevo Estudiante
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="w-full bg-white/60 dark:bg-slate-700/50 border border-white/50 dark:border-slate-600 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" 
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                <th className="py-4 px-4 font-semibold">Estudiante</th>
                <th className="py-4 px-4 font-semibold">Curso</th>
                <th className="py-4 px-4 font-semibold">Documento</th>
                <th className="py-4 px-4 font-semibold">Estado</th>
                <th className="py-4 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {s.student?.name1?.charAt(0) || '?'}
                    </div>
                    {s.student?.name1} {s.student?.lastName1}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{s.student?.grade} {s.student?.section}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{s.student?.docType}: {s.student?.docNumber}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.student?.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'}`}>
                      {s.student?.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right flex justify-end gap-2">
                    <button onClick={() => setSelectedStudent(s)} className="p-2 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"><Eye size={18} /></button>
                    {/* El lapiz te lleva a la pantalla de edición (debes crearla o usar el mismo wizard con ID) */}
                    <button onClick={() => navigate(`/students/edit/${s.id}`)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>

      {/* Modal de Ver Estudiante */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 dark:text-white">Detalle del Estudiante</h2>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between"><span className="text-slate-500">Nombre:</span> <span className="font-bold dark:text-white">{selectedStudent.student?.name1} {selectedStudent.student?.lastName1}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Documento:</span> <span className="font-bold dark:text-white">{selectedStudent.student?.docType} {selectedStudent.student?.docNumber}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-bold dark:text-white">{selectedStudent.student?.email}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Teléfono:</span> <span className="font-bold dark:text-white">{selectedStudent.student?.phone}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Tutor:</span> <span className="font-bold dark:text-white">{selectedStudent.student?.tutorName}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Curso:</span> <span className="font-bold dark:text-white">{selectedStudent.student?.grade} {selectedStudent.student?.section}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}