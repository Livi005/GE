import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, User, Users } from 'lucide-react';

export default function AuditGradesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  
  // Datos de ejemplo para la simulación
  const mockData = [
    { idC: 1, name: '2024-2025', subjects: [
      { idSub: 1, name: 'Matemáticas', students: [
        { id: 1, name: 'Ana Torres', grade: 8.5 },
        { id: 2, name: 'Luis Gómez', grade: 6.0 },
      ]},
      { idSub: 2, name: 'Física', students: [
        { id: 3, name: 'Ana Torres', grade: 9.0 },
      ]}
    ]}
  ];

  useEffect(() => { setCourses(mockData); }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Auditoría de Notas</h1>
        <p className="text-slate-500 dark:text-slate-400">Revisa el historial de calificaciones por curso y asignatura.</p>
      </div>

      <div className="space-y-4">
        {courses.map(course => (
          <div key={course.idC} className="glass-card overflow-hidden dark:border-slate-700">
            <button 
              onClick={() => setExpandedCourse(expandedCourse === course.idC ? null : course.idC)}
              className="w-full flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <span className="text-xl font-bold text-slate-800 dark:text-white">Curso {course.name}</span>
              </div>
              {expandedCourse === course.idC ? <ChevronDown size={24} className="text-slate-400 dark:text-slate-400" /> : <ChevronRight size={24} className="text-slate-400 dark:text-slate-400" />}
            </button>

            {expandedCourse === course.idC && (
              <div className="p-4 bg-white/20 dark:bg-slate-800/20 border-t border-white/40 dark:border-slate-700 space-y-2">
                {course.subjects.map((sub: any) => (
                  <div key={sub.idSub} className="bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 overflow-hidden">
                    <button 
                      onClick={() => setExpandedSubject(expandedSubject === sub.idSub ? null : sub.idSub)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/80 dark:hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} className="text-purple-500 dark:text-purple-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.name}</span>
                      </div>
                      {expandedSubject === sub.idSub ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                    </button>

                    {expandedSubject === sub.idSub && (
                      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <th className="pb-2">Estudiante</th>
                              <th className="pb-2 text-right">Nota</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sub.students.map((st: any) => (
                              <tr key={st.id} className="border-t border-slate-100 dark:border-slate-700">
                                <td className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                  <User size={14} className="text-slate-400 dark:text-slate-400"/> {st.name}
                                </td>
                                <td className="py-2 text-right">
                                  <span className={`font-bold text-sm ${st.grade >= 5 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {st.grade} / 10
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}