import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { GradesService } from '../services/grades.service';
import { apiClient } from '../api/client';
import { CheckCircle, XCircle, Clock, BookOpen, Save, Calendar, Check } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function AttendancePage() {
  const { userName } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userName) GradesService.getMySubjects(userName).then(setSubjects);
  }, [userName]);

  const handleSubjectClick = async (sub: any) => {
    setSelectedSubject(sub);
    setSaved(false);
    setLoading(true);
    try {
      // 1. Obtener alumnos de la asignatura
      const studs = await GradesService.getStudentsBySubject(sub.idSub);
      
      // 2. Obtener asistencia existente para esa fecha
      const res = await apiClient.get(`/api/attendance/get?idSub=${sub.idSub}&date=${date}T00:00:00`);
      const existing = res.data || [];
      
      // Mapear
      const mapped = studs.map((s: any) => {
        const record = existing.find((e: any) => e.idStud === s.idStud);
        let status = 0; // 0 = Present por defecto
        if (record) status = record.status;
        return { ...s, status };
      });
      setStudents(mapped);
    } catch (err) {
      console.error(err);
      alert("Error al cargar asistencia");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (index: number, status: number) => {
    const newStudents = [...students];
    newStudents[index].status = status;
    setStudents(newStudents);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      const payload = {
        idSub: selectedSubject.idSub,
        date: `${date}T00:00:00`,
        records: students.map(s => ({ idStud: s.idStud, status: s.status }))
      };
      await apiClient.post('/api/attendance/save', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Error al guardar asistencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Pasar Asistencia</h1>
          <p className="text-slate-500 dark:text-slate-400">Registra la asistencia diaria de tus alumnos.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border dark:border-slate-700">
          <Calendar size={18} className="text-purple-500" />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => { setDate(e.target.value); if (selectedSubject) handleSubjectClick(selectedSubject); }}
            className="bg-transparent border-none focus:outline-none text-slate-800 dark:text-white font-semibold text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 h-fit dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Mis Asignaturas</h3>
          <div className="space-y-2">
            {subjects.map(sub => (
              <button 
                key={sub.idSub} 
                onClick={() => handleSubjectClick(sub)} 
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  selectedSubject?.idSub === sub.idSub 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 font-bold shadow-sm' 
                    : 'hover:bg-white/60 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <BookOpen size={18} className={selectedSubject?.idSub === sub.idSub ? 'text-purple-600' : 'text-slate-400'} />
                {sub.nameSub}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 md:col-span-2 dark:border-slate-700">
          {!selectedSubject ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4"><Calendar size={32} className="text-purple-400" /></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Selecciona una asignatura para comenzar.</p>
            </div>
          ) : loading ? (
            <LoadingState message="Cargando asistencia..." />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Lista de {selectedSubject.nameSub}</h3>
                <span className="text-sm text-slate-500 bg-white/50 px-3 py-1 rounded-full">{students.length} alumnos</span>
              </div>
              
              <div className="space-y-3">
                {students.map((st, i) => (
                  <div key={st.idStud} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl border dark:border-slate-600 gap-4">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{st.nameStud.charAt(0)}</div>
                      {st.nameStud}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusChange(i, 0)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${st.status === 0 ? 'bg-green-100 text-green-700 ring-2 ring-green-400' : 'text-slate-400 hover:bg-green-50'}`}><CheckCircle size={16} /> Presente</button>
                      <button onClick={() => handleStatusChange(i, 1)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${st.status === 1 ? 'bg-red-100 text-red-700 ring-2 ring-red-400' : 'text-slate-400 hover:bg-red-50'}`}><XCircle size={16} /> Ausente</button>
                      <button onClick={() => handleStatusChange(i, 2)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${st.status === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-400' : 'text-slate-400 hover:bg-orange-50'}`}><Clock size={16} /> Tarde</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end items-center gap-4">
                {saved && <span className="text-green-600 font-bold flex items-center gap-2"><Check size={20} /> Guardado</span>}
                <button onClick={handleSave} disabled={loading} className="btn-lyra px-8 py-3 flex items-center gap-2">
                  <Save size={20} /> Guardar Asistencia
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}