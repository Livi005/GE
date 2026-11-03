import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { BookOpen, Users, FileText, Clock, ChevronRight, TrendingUp } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function ProfessorDashboard() {
  const { userName } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userName) return;
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get(`/dashboard/professor/${userName}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [userName]);

  if (loading) return <LoadingState message="Cargando tus clases..." />;
  if (error) return <LoadingState message="No se pudo cargar la información." isError />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          ¡Hola, Profe! <span className="text-4xl">👨‍🏫</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-400 mt-2">Este es el resumen de tus clases para hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 rounded-2xl flex items-center justify-center"><BookOpen size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data.totalSubjects}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Asignaturas</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 rounded-2xl flex items-center justify-center"><Users size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data.totalStudents}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Estudiantes</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-14 h-14 bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400 rounded-2xl flex items-center justify-center"><FileText size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data.pendingGrades}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Notas Pendientes</p></div>
        </div>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Clock size={22} className="text-purple-600"/> Mis clases de hoy</h3>
        </div>
        <div className="space-y-4">
          {!data.todayClasses || data.todayClasses.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-4">No tienes clases programadas para hoy.</p>
          ) : data.todayClasses.map((sub: any) => (
            <div key={sub.idSub} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/80 dark:bg-slate-700/50 rounded-2xl border border-white/80 dark:border-slate-600 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{sub.nameSub}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{sub.students} alumnos</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1"><Clock size={14} className="text-purple-600"/> {sub.nextClass || 'Hoy'}</p>
                </div>
                <button onClick={() => navigate('/grades')} className="p-2 bg-slate-200 dark:bg-slate-600 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                  <ChevronRight size={20} className="text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div onClick={() => navigate('/grades')} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-white/80 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400 rounded-xl flex items-center justify-center"><FileText size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Poner Notas</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Califica a tus alumnos</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </div>
        <div onClick={() => navigate('/attendance')} className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-white/80 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-xl flex items-center justify-center"><TrendingUp size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Pasar Asistencia</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Registra la asistencia de hoy</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}