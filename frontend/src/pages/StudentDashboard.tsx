import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { BookOpen, Calendar, TrendingUp, Clock, Star, User, Award } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function StudentDashboard() {
  const { userName } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userName) return;
    const fetchDashboard = async () => {
      try {
        // 1. Llamamos al endpoint del dashboard
        const res = await apiClient.get(`/dashboard/student/${userName}`);
        setData(res.data);
      } catch (err) {
        console.error("Error cargando dashboard estudiante:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [userName]);

  if (loading) return <LoadingState message="Cargando tu información..." />;
  if (error) return <LoadingState message="No se pudo cargar la información del servidor." isError />;

  // Validar si el backend devolvió datos reales
  const hasGrades = data?.grades && data.grades.length > 0;
  const hasSchedule = data?.schedule && data.schedule.length > 0;
  const hasProfessors = data?.professors && data.professors.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          ¡Hola, {data?.studentName || 'Estudiante'}! <span className="text-4xl">👋</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-400 mt-2 font-medium">Bienvenido a tu panel. Curso: {data?.courseName || 'Sin curso'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center"><TrendingUp size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.averageGrade ? data.averageGrade.toFixed(1) : '0.0'}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Promedio</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center"><BookOpen size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.grades?.length || 0}</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Asignaturas</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-pink-100 text-pink-700 rounded-2xl flex items-center justify-center"><Award size={28} /></div>
          <div><p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.attendancePercentage || 0}%</p><p className="text-sm text-slate-700 dark:text-slate-400 font-bold">Asistencia</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp size={22} className="text-blue-600"/> Mis Calificaciones</h3>
            <button onClick={() => navigate('/my-grades')} className="text-sm font-bold text-blue-700 hover:underline">Ver todas</button>
          </div>
          <div className="space-y-3">
            {!hasGrades ? (
               <div className="text-center py-6 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                 <p className="text-slate-600 dark:text-slate-400 font-medium">No hay notas registradas todavía.</p>
               </div>
            ) : data.grades.slice(0, 3).map((g: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-white/80 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{g.subjectName || g.subject}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">{g.teacherName || g.teacher}</p>
                </div>
                <span className={`font-extrabold text-lg ${g.grade >= 9 ? 'text-green-700' : g.grade >= 7 ? 'text-blue-700' : 'text-orange-600'}`}>{g.grade.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Calendar size={22} className="text-pink-600"/> Horario de Hoy</h3>
            <button onClick={() => navigate('/my-schedule')} className="text-sm font-bold text-pink-700 hover:underline">Ver semana</button>
          </div>
          <div className="space-y-3">
            {!hasSchedule ? (
              <div className="text-center py-6 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                 <p className="text-slate-600 dark:text-slate-400 font-medium">No tienes clases programadas hoy.</p>
               </div>
            ) : data.schedule.map((s: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600">
                <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{s.subjectName || s.subject}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-medium flex items-center gap-1"><Clock size={12}/> {s.time || s.hour} • {s.room || s.classRoomLocation}</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md">{s.type || 'Clase'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><User size={22} className="text-purple-600"/> Mis Profesores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!hasProfessors ? (
            <div className="text-center py-6 bg-slate-100 dark:bg-slate-700/50 rounded-xl col-span-1 md:col-span-2">
               <p className="text-slate-600 dark:text-slate-400 font-medium">No tienes profesores asignados.</p>
             </div>
          ) : data.professors.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(p.profName || p.name || 'P').charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{p.profName || p.name}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">{p.subjectName || p.subject}</p>
                </div>
              </div>
              <button onClick={() => navigate('/my-professors')} className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-200 transition-colors">
                <Star size={12} /> Evaluar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}