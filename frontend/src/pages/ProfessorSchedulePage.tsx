import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Calendar, Clock } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function ProfessorSchedulePage() {
  const { userName } = useAuthStore();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userName) return;
    apiClient.get(`/api/schedule/professor/${userName}`)
      .then(res => setSchedule(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userName]);

  if (loading) return <LoadingState message="Cargando tu horario..." />;

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const timeSlots = Array.from(new Set(schedule.map(s => s.startTime)))
    .sort()
    .map(start => {
      const end = schedule.find(s => s.startTime === start)?.endTime;
      return `${start} - ${end}`;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Calendar className="text-blue-500" size={32} /> Mi Horario Semanal
        </h1>
      </div>

      <div className="glass-card p-6 overflow-x-auto dark:bg-slate-800/50 dark:border-slate-700">
        {schedule.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No tienes clases programadas.</p>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-3 border-b border-slate-200 dark:border-slate-700 text-slate-400 text-sm w-32">Hora</th>
                {days.map(day => (
                  <th key={day} className="p-3 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, idx) => (
                <tr key={idx}>
                  <td className="p-3 text-sm font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 flex items-center gap-1">
                    <Clock size={14} /> {slot}
                  </td>
                  {days.map((day, dayIdx) => {
                    const classData = schedule.find(s => s.day === (dayIdx + 1) && s.startTime === slot.split(' - ')[0]);
                    return (
                      <td key={day} className="p-2 border-b border-slate-100 dark:border-slate-700 align-top">
                        {classData ? (
                          <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-xl h-full">
                            <p className="font-bold text-sm text-slate-800 dark:text-white">{classData.subjectName}</p>
                            <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-2 bg-purple-100 dark:bg-purple-900/50 inline-block px-2 py-0.5 rounded">{classData.classRoomLocation}</p>
                          </div>
                        ) : (
                          <div className="h-full min-h-[80px]"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}