import { useState, useEffect } from 'react';
import { CourseService, Course } from '../services/course.service';
import { StudentService } from '../services/student.service';
import { ChevronDown, ChevronRight, Users, BookOpen, Search } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [coursesData, studentsData] = await Promise.all([
          CourseService.getAll(),
          StudentService.getAll()
        ]);
        setCourses(coursesData);
        setStudents(studentsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStudentsByCourse = (courseId: number) => {
    return students.filter(s => s.idC === courseId && s.student?.name1?.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  if (loading) return <LoadingState message="Cargando cursos..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Cursos Académicos</h1>
        <p className="text-slate-500 dark:text-slate-400">Explora los cursos y los alumnos matriculados.</p>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-3 text-slate-400" size={20} />
        <input type="text" placeholder="Buscar alumno..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/60 dark:bg-slate-700/50 border rounded-xl pl-12 pr-4 py-3 focus:outline-none dark:text-white" />
      </div>

      <div className="space-y-4">
        {courses.map(course => {
          const courseStudents = getStudentsByCourse(course.idC);
          return (
            <div key={course.idC} className="glass-card overflow-hidden dark:bg-slate-800/50 dark:border-slate-700">
              <button 
                onClick={() => setExpandedCourse(expandedCourse === course.idC ? null : course.idC)}
                className="w-full flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-md">
                    <BookOpen size={24} />
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-bold text-slate-800 dark:text-white block">{course.courseName}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{courseStudents.length} estudiantes matriculados</span>
                  </div>
                </div>
                {expandedCourse === course.idC ? <ChevronDown size={24} className="text-slate-400" /> : <ChevronRight size={24} className="text-slate-400" />}
              </button>

              {expandedCourse === course.idC && (
                <div className="p-6 bg-white/20 dark:bg-slate-800/20 border-t border-white/40 dark:border-slate-700">
                  <h4 className="font-bold text-slate-700 dark:text-white mb-4 flex items-center gap-2"><Users size={18} className="text-purple-500"/> Lista de Alumnos</h4>
                  {courseStudents.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">No hay alumnos en este curso.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {courseStudents.map(st => (
                        <div key={st.id} className="bg-white/60 dark:bg-slate-700/50 p-3 rounded-xl border border-white/80 dark:border-slate-600 flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                            {st.student?.name1?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-white">{st.student?.name1} {st.student?.lastName1}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{st.student?.docNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}