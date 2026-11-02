import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { GradesService } from '../services/grades.service';
import { ChevronDown, ChevronRight, BookOpen, User, AlertTriangle, CheckCircle, Clock, TrendingUp, Save, X } from 'lucide-react';

export default function MyGradesPage() {
  const { userName } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'summary'>('grades');

  // Estados para edición en línea
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [tempGrade, setTempGrade] = useState<string>('');

  useEffect(() => {
    if (userName) loadData();
  }, [userName]);

  const loadData = async () => {
    setLoading(true);
    const subs = await GradesService.getMySubjects(userName!);
    const subsWithStudents = await Promise.all(subs.map(async (sub: any) => {
      const students = await GradesService.getStudentsBySubject(sub.idSub);
      const allGrades = await GradesService.getGradesByProfessor(userName!);
      
      const studentsWithGrades = students.map((st: any) => {
        const gradeRecord = allGrades.find((g: any) => g.idStud === st.idStud && g.idSub === sub.idSub);
        return { ...st, gradeId: gradeRecord?.idProfStudSub, grade: gradeRecord?.studentGrades || 0 };
      });
      return { ...sub, students: studentsWithGrades };
    }));
    
    setSubjects(subsWithStudents);
    setLoading(false);
  };

  const getStudentStatus = (grade: number) => {
    if (grade >= 9) return { label: 'Excelente', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle };
    if (grade >= 7) return { label: 'Bueno', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock };
    if (grade >= 5) return { label: 'En progreso', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertTriangle };
    return { label: 'En riesgo', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle };
  };

  const handleGradeChange = (student: any) => {
    setEditingStudentId(student.idStud);
    setTempGrade(student.grade.toString());
  };

  const saveGrade = async (student: any) => {
    const gradeValue = parseFloat(tempGrade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 10) {
      setEditingStudentId(null);
      return;
    }
    
    try {
      await GradesService.updateGrade(student.gradeId, gradeValue);
      const updatedSubjects = subjects.map(sub => ({
        ...sub,
        students: sub.students.map((st: any) => 
          st.idStud === student.idStud ? { ...st, grade: gradeValue } : st
        )
      }));
      setSubjects(updatedSubjects);
    } catch {
      alert("Error al guardar la nota");
    } finally {
      setEditingStudentId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Mis Asignaturas</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona las calificaciones y el progreso de tus estudiantes.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-slate-500 dark:text-slate-400">Cargando tus clases...</p>
        ) : subjects.length === 0 ? (
          <div className="glass-card p-10 text-center dark:bg-slate-800/50 dark:border-slate-700">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No tienes asignaturas asignadas actualmente.</p>
          </div>
        ) : subjects.map(sub => (
          <div key={sub.idSub} className="glass-card overflow-hidden dark:bg-slate-800/50 dark:border-slate-700">
            <button 
              onClick={() => setExpandedSubject(expandedSubject === sub.idSub ? null : sub.idSub)}
              className="w-full flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-xl flex items-center justify-center shadow-md"><BookOpen size={24} /></div>
                <div className="text-left">
                  <span className="text-xl font-bold text-slate-800 dark:text-white block">{sub.nameSub}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{sub.students.length} estudiantes matriculados</span>
                </div>
              </div>
              {expandedSubject === sub.idSub ? <ChevronDown size={24} className="text-slate-400" /> : <ChevronRight size={24} className="text-slate-400" />}
            </button>

            {expandedSubject === sub.idSub && (
              <div className="p-6 bg-white/20 dark:bg-slate-800/20 border-t border-white/40 dark:border-slate-700">
                {/* Pestañas */}
                <div className="flex gap-6 mb-6 border-b border-slate-200 dark:border-slate-700">
                  <button onClick={() => setActiveTab('grades')} className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'grades' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Calificaciones</button>
                  <button onClick={() => setActiveTab('attendance')} className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'attendance' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Asistencia</button>
                  <button onClick={() => setActiveTab('summary')} className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'summary' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Resumen</button>
                </div>

                {activeTab === 'grades' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                          <th className="pb-3 pl-2">Estudiante</th>
                          <th className="pb-3 text-center">Calificación (/10)</th>
                          <th className="pb-3 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sub.students.map((st: any) => {
                          const status = getStudentStatus(st.grade);
                          const StatusIcon = status.icon;
                          return (
                            <tr key={st.idStud} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="py-3 pl-2 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                                  {st.nameStud.charAt(0)}
                                </div>
                                {st.nameStud}
                              </td>
                              <td className="py-3 text-center">
                                {editingStudentId === st.idStud ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <input 
                                      type="number" 
                                      step="0.1" min="0" max="10" 
                                      value={tempGrade} 
                                      onChange={(e) => setTempGrade(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && saveGrade(st)}
                                      className="w-16 px-2 py-1 text-center rounded-lg border-2 border-purple-500 focus:outline-none dark:bg-slate-700 dark:text-white font-bold"
                                      autoFocus
                                    />
                                    <button onClick={() => saveGrade(st)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={16}/></button>
                                    <button onClick={() => setEditingStudentId(null)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={16}/></button>
                                  </div>
                                ) : (
                                  <span 
                                    onClick={() => handleGradeChange(st)}
                                    className={`inline-block w-16 py-1 rounded-lg font-bold text-lg cursor-pointer border-2 border-transparent hover:border-purple-400 transition-all ${st.grade >= 5 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
                                  >
                                    {st.grade.toFixed(1)}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-center">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                  <StatusIcon size={14} /> {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                    <div className="relative w-40 h-40 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="3"></circle>
                        <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-green-500" strokeWidth="3" strokeDasharray="41 100" strokeDashoffset="0"></circle>
                        <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-blue-500" strokeWidth="3" strokeDasharray="33 100" strokeDashoffset="-41"></circle>
                        <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-red-500" strokeWidth="3" strokeDasharray="26 100" strokeDashoffset="-74"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{sub.students.length}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">estudiantes</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3 w-full max-w-xs">
                      <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-green-500"></span> Excelente (9-10)</span><span className="font-bold text-slate-800 dark:text-white">{sub.students.filter((s:any)=>s.grade>=9).length}</span></div>
                      <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Bueno (7-8.9)</span><span className="font-bold text-slate-800 dark:text-white">{sub.students.filter((s:any)=>s.grade>=7 && s.grade<9).length}</span></div>
                      <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 rounded-full bg-red-500"></span> En riesgo (&lt;7)</span><span className="font-bold text-slate-800 dark:text-white">{sub.students.filter((s:any)=>s.grade<7).length}</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'attendance' && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>El módulo de asistencia está disponible en la sección "Asistencias".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}