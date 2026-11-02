import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, User, Users, GraduationCap, Search, DollarSign, Briefcase } from 'lucide-react';

export default function ExplorerPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'professors'>('students');
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const [expandedProf, setExpandedProf] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);

  useEffect(() => {
    // Simulación de carga de datos del explorador
    setTimeout(() => {
      setCourses([
        { 
          idC: 1, courseName: '3° de Primaria A', 
          subjects: [
            { idSub: 1, nameSub: 'Matemáticas', students: [
              { id: 1, name: 'Ana Torres', age: 8, absences: 0, grade: 9.5 },
              { id: 2, name: 'Luis Gómez', age: 8, absences: 2, grade: 7.0 },
            ]},
            { idSub: 2, nameSub: 'Física', students: [
              { id: 3, name: 'Ana Torres', age: 8, absences: 1, grade: 8.0 },
            ]},
          ]
        },
        { 
          idC: 2, courseName: '4° de Secundaria B', 
          subjects: [
            { idSub: 3, nameSub: 'Álgebra', students: [
              { id: 4, name: 'Carlos Ruiz', age: 15, absences: 0, grade: 8.5 },
            ]},
          ]
        }
      ]);

      setProfessors([
        { id: 1, name: 'Prof. Gómez', spec: 'Matemáticas', salary: 2500, experience: 10, rating: 4.8 },
        { id: 2, name: 'Prof. Ruiz', spec: 'Física', salary: 2200, experience: 7, rating: 4.5 },
        { id: 3, name: 'Prof. Torres', spec: 'Álgebra', salary: 2400, experience: 12, rating: 4.9 },
      ]);
      setLoading(false);
    }, 300);
  }, []);

  const filteredCourses = courses.filter(c => c.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProfessors = professors.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.spec.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Explorador Académico</h1>
          <p className="text-slate-500 dark:text-slate-400">Consulta toda la información general del centro.</p>
        </div>

        <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl backdrop-blur-md border border-white/60 dark:border-slate-700">
          <button onClick={() => setActiveTab('students')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'students' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            <Users size={18} /> Alumnos por Curso
          </button>
          <button onClick={() => setActiveTab('professors')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'professors' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            <GraduationCap size={18} /> Profesores
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={`Buscar ${activeTab === 'students' ? 'curso' : 'profesor'}...`} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/60 dark:bg-slate-700/50 border border-white/50 dark:border-slate-600 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" 
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">Cargando datos del centro...</div>
      ) : (
        <>
          {activeTab === 'students' && (
            <div className="space-y-4">
              {filteredCourses.map(course => (
                <div key={course.idC} className="glass-card overflow-hidden dark:bg-slate-800/50 dark:border-slate-700">
                  <button 
                    onClick={() => setExpandedCourse(expandedCourse === course.idC ? null : course.idC)}
                    className="w-full flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/60 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center"><Users size={20} /></div>
                      <span className="text-xl font-bold text-slate-800 dark:text-white">Curso {course.courseName}</span>
                    </div>
                    {expandedCourse === course.idC ? <ChevronDown size={24} className="text-slate-500 dark:text-slate-400" /> : <ChevronRight size={24} className="text-slate-500 dark:text-slate-400" />}
                  </button>

                  {expandedCourse === course.idC && (
                    <div className="p-4 bg-white/20 dark:bg-slate-900/30 border-t border-white/40 dark:border-slate-700 space-y-2">
                      {course.subjects.map((sub: any) => (
                        <div key={sub.idSub} className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/80 dark:border-slate-700 overflow-hidden">
                          <button 
                            onClick={() => setExpandedSubject(expandedSubject === sub.idSub ? null : sub.idSub)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/80 dark:hover:bg-slate-700/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen size={18} className="text-blue-500 dark:text-blue-400" />
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{sub.nameSub}</span>
                            </div>
                            {expandedSubject === sub.idSub ? <ChevronDown size={18} className="text-slate-500 dark:text-slate-400" /> : <ChevronRight size={18} className="text-slate-500 dark:text-slate-400" />}
                          </button>

                          {expandedSubject === sub.idSub && (
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40">
                              <table className="w-full text-left">
                                <thead>
                                  <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <th className="pb-2">Estudiante</th>
                                    <th className="pb-2">Edad</th>
                                    <th className="pb-2">Ausencias</th>
                                    <th className="pb-2 text-right">Nota</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sub.students.map((st: any) => (
                                    <tr key={st.id} className="border-t border-slate-100 dark:border-slate-700">
                                      <td className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><User size={14} className="text-slate-400"/> {st.name}</td>
                                      <td className="py-2 text-sm text-slate-600 dark:text-slate-400">{st.age} años</td>
                                      <td className="py-2 text-sm text-slate-600 dark:text-slate-400">{st.absences} faltas</td>
                                      <td className="py-2 text-right"><span className={`font-bold text-sm ${st.grade >= 5 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{st.grade} / 10</span></td>
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
          )}

          {activeTab === 'professors' && (
            <div className="space-y-4">
              {filteredProfessors.map(prof => (
                <div key={prof.id} className="glass-card overflow-hidden dark:bg-slate-800/50 dark:border-slate-700">
                  <button 
                    onClick={() => setExpandedProf(expandedProf === prof.id ? null : prof.id)}
                    className="w-full flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/60 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center"><GraduationCap size={20} /></div>
                      <div className="text-left">
                        <span className="text-xl font-bold text-slate-800 dark:text-white block">{prof.name}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Especialidad: {prof.spec}</span>
                      </div>
                    </div>
                    {expandedProf === prof.id ? <ChevronDown size={24} className="text-slate-500 dark:text-slate-400" /> : <ChevronRight size={24} className="text-slate-500 dark:text-slate-400" />}
                  </button>

                  {expandedProf === prof.id && (
                    <div className="p-6 bg-white/20 dark:bg-slate-900/30 border-t border-white/40 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-white/80 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><DollarSign size={14}/> Salario</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">${prof.salary.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-white/80 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Evaluación Media</p>
                        <p className="text-lg font-bold text-yellow-500">{prof.rating} / 5.0</p>
                      </div>
                      <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-white/80 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Briefcase size={14}/> Experiencia</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">{prof.experience} años</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}