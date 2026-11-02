import { useState, useEffect } from 'react';
import { CourseService, Course } from '../services/course.service';
import { ChevronDown, ChevronRight, Users, BookOpen } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await CourseService.getAll();
      setCourses(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Cargando cursos..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Cursos Académicos</h1>
        <p className="text-slate-500 dark:text-slate-400">Explora los cursos disponibles.</p>
      </div>

      {courses.length === 0 ? (
        <div className="glass-card p-12 text-center dark:bg-slate-800/50">
          <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No hay cursos registrados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
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
                  </div>
                </div>
                {expandedCourse === course.idC ? <ChevronDown size={24} className="text-slate-400" /> : <ChevronRight size={24} className="text-slate-400" />}
              </button>

              {expandedCourse === course.idC && (
                <div className="p-6 bg-white/20 dark:bg-slate-800/20 border-t border-white/40 dark:border-slate-700">
                  <h4 className="font-bold text-slate-700 dark:text-white mb-4 flex items-center gap-2"><Users size={18} className="text-purple-500"/> Lista de Alumnos</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">La lista de alumnos se cargará aquí cuando el backend esté listo.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}