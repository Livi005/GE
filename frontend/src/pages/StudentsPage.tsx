import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentService, StudentResponse } from '../services/student.service';
import { useAuthStore } from '../store/authStore';
import { Search, Plus, Edit2, Trash2, Download, Eye, X } from 'lucide-react';
import Pagination from '../components/Pagination';
import { exportToCsv } from '../utils/exportToCsv';
import LoadingState from '../components/LoadingState';

export default function StudentsPage() {
  const navigate = useNavigate();
  const { role } = useAuthStore();
  
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name1: '', lastName1: '', email: '', phone: '', address: '', grade: '', section: '', docType: 'DNI', docNumber: '', isActive: true
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await StudentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar a este estudiante?')) {
      try {
        await StudentService.delete(id);
        loadStudents();
      } catch (err: any) {
        alert(err.response?.data?.detail || "Error al eliminar estudiante.");
      }
    }
  };

  const handleOpenEditModal = (student: any) => {
    setEditingStudent(student);
    setEditFormData({
      name1: student.student.name1 || '',
      lastName1: student.student.lastName1 || '',
      email: student.student.email || '',
      phone: student.student.phone || '',
      address: student.student.address || '',
      grade: student.student.grade || '',
      section: student.student.section || '',
      docType: student.student.docType || 'DNI',
      docNumber: student.student.docNumber || '',
      isActive: student.student.isActive !== undefined ? student.student.isActive : true
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name1: editFormData.name1,
        lastName1: editFormData.lastName1,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
        grade: editFormData.grade,
        section: editFormData.section,
        docType: editFormData.docType,
        docNumber: editFormData.docNumber,
        isActive: editFormData.isActive,
        idC: editingStudent.idC 
      };
      await StudentService.update(editingStudent.id, payload);
      setIsEditModalOpen(false);
      loadStudents();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error al actualizar estudiante.");
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

  const filtered = students
    .filter(s => {
      const name = s.student?.name1 || '';
      const lastName = s.student?.lastName1 || '';
      const doc = s.student?.docNumber || '';
      return `${name} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || doc.includes(searchTerm);
    })
    .sort((a, b) => {
      const nameA = a.student?.name1 || '';
      const nameB = b.student?.name1 || '';
      return nameA.localeCompare(nameB);
    });
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingState message="Cargando estudiantes..." />;

  const canEdit = role === 'Director' || role === 'Secretary' || role === 'SuperAdmin';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Estudiantes</h1>
          <p className="text-slate-700 dark:text-slate-400 font-medium">Gestiona la lista de alumnos del centro.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-3 bg-white/80 border border-slate-300 rounded-xl flex items-center gap-2 text-slate-800 hover:bg-white transition-colors font-bold shadow-sm">
            <Download size={18} /> Exportar
          </button>
          
          {canEdit && (
            <button onClick={() => navigate('/students/create')} className="btn-lyra px-6 py-3 flex items-center gap-2">
              <Plus size={20} /> Nuevo Estudiante
            </button>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-4 top-3 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="w-full bg-white/80 border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium shadow-sm" 
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm">
                <th className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Estudiante</th>
                <th className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Curso</th>
                <th className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Documento</th>
                <th className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Estado</th>
                <th className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
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
                    
                    {canEdit && (
                      <>
                        <button onClick={() => handleOpenEditModal(s)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </>
                    )}
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
          <div className="glass-card w-full max-w-md p-8 relative bg-white/90 dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white">Detalle del Estudiante</h2>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-600 font-semibold">Nombre:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.student?.name1} {selectedStudent.student?.lastName1}</span></p>
              <p className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-600 font-semibold">Documento:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.student?.docType} {selectedStudent.student?.docNumber}</span></p>
              <p className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-600 font-semibold">Email:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.student?.email}</span></p>
              <p className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-600 font-semibold">Teléfono:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.student?.phone}</span></p>
              <p className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-600 font-semibold">Tutor:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.student?.tutorName}</span></p>
              <p className="flex justify-between"><span className="text-slate-600 font-semibold">Curso:</span> <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.student?.grade} {selectedStudent.student?.section}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Estudiante */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative bg-white/90 dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white">Editar Estudiante</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Nombres</label><input type="text" required value={editFormData.name1} onChange={(e) => setEditFormData({...editFormData, name1: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" /></div>
                <div><label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Apellidos</label><input type="text" required value={editFormData.lastName1} onChange={(e) => setEditFormData({...editFormData, lastName1: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" /></div>
              </div>
              <div><label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Email</label><input type="email" required value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" /></div>
              <div><label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Teléfono</label><input type="text" required value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Grado</label><input type="text" required value={editFormData.grade} onChange={(e) => setEditFormData({...editFormData, grade: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" /></div>
                <div><label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Sección</label><input type="text" required value={editFormData.section} onChange={(e) => setEditFormData({...editFormData, section: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" /></div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" checked={editFormData.isActive} onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
                <label className="text-sm font-bold text-slate-800 dark:text-slate-300">¿Estudiante activo?</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-700 font-bold bg-slate-200 hover:bg-slate-300 transition-colors">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}