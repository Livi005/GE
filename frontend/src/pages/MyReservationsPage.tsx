import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Calendar, Trash2, CheckCircle } from 'lucide-react';

export default function MyReservationsPage() {
  const { userName } = useAuthStore();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReservations([
      { id: 1, subject: 'Matemáticas', room: 'Aula 101', date: 'Hoy, 08:00 - 09:00', means: 'Proyector' },
    ]);
    setLoading(false);
  }, [userName]);

  const handleCancel = async (subject: string) => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      setReservations(reservations.filter(r => r.subject !== subject));
      alert("Reserva cancelada.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Mis Reservas</h1>
        <p className="text-slate-500 dark:text-slate-400">Historial de aulas y medios reservados.</p>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        {loading ? (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">Cargando...</p>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No tienes reservas activas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map(res => (
              <div key={res.id} className="p-5 bg-white/60 dark:bg-slate-700/50 rounded-2xl border border-white/80 dark:border-slate-600 shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{res.subject}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1"><Calendar size={14}/> {res.date}</p>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-2 bg-purple-100 dark:bg-purple-900/50 inline-block px-2 py-1 rounded-md">{res.room} • {res.means}</p>
                </div>
                <button onClick={() => handleCancel(res.subject)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}