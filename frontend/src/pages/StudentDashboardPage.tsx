import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { DashboardService } from '../services/dashboard.service';
import { BookOpen, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export default function StudentDashboardPage() {
  const { userName } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userName) {
      DashboardService.getStudentData(userName).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [userName]);

  if (loading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Cargando tus datos...</div>;
  if (!data) return <div className="text-center py-20 text-red-500 dark:text-red-400">No se pudieron cargar tus datos.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white mb-2">¡Hola, {data.studentName}! 👋</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Curso: {data.courseName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notas Reales */}
        <div className="glass-card p-8 dark:bg-slate-800/50 dark:border-slate-700">
          <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={22} className="text-blue-500 dark:text-blue-400"/> Mis Calificaciones
          </h3>
          <div className="space-y-3">
            {data.grades.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">Aún no tienes notas registradas.</p>
            ) : (
              data.grades.map((g: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 shadow-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><BookOpen size={16} className="text-purple-400 dark:text-purple-400"/> {g.subjectName}</span>
                  <span className={`font-bold text-lg ${g.grade >= 5 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{g.grade.toFixed(1)} / 10</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Horario Simulado */}
        <div className="glass-card p-8 dark:bg-slate-800/50 dark:border-slate-700">
          <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Clock size={22} className="text-pink-500 dark:text-pink-400"/> Horario de Hoy
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Matemáticas</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">08:00 - 09:00 • Aula 101</p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">Clase</span>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Física</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">10:00 - 11:00 • Lab 2</p>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">Práctica</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}