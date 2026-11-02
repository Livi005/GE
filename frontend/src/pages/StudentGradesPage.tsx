import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    setGrades([
      { id: 1, subject: 'Matemáticas', grade: 9.5, teacher: 'Prof. Gómez' },
      { id: 2, subject: 'Física', grade: 8.0, teacher: 'Prof. Ruiz' },
      { id: 3, subject: 'Álgebra', grade: 7.5, teacher: 'Prof. Gómez' },
    ]);
  }, []);

  const average = grades.length > 0 ? (grades.reduce((acc, g) => acc + g.grade, 0) / grades.length).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <TrendingUp className="text-blue-500" size={32} /> Mis Calificaciones
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Consulta tus notas por asignatura.</p>
      </div>

      <div className="glass-card p-8 dark:bg-slate-800/50 dark:border-slate-700 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-2">Promedio General</p>
        <p className="text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{average}</p>
        <p className="text-sm text-slate-400 mt-2">Basado en {grades.length} asignaturas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grades.map((g) => (
          <div key={g.id} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-xl flex items-center justify-center"><BookOpen size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{g.subject}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{g.teacher}</p>
              </div>
            </div>
            <span className={`text-3xl font-extrabold ${g.grade >= 9 ? 'text-green-600' : g.grade >= 7 ? 'text-blue-600' : 'text-orange-500'}`}>{g.grade.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}