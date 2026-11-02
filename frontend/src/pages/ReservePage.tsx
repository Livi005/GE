import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ReservationService } from '../services/reservation.service';
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { apiClient } from '../api/client'; 

export default function ReservePage() {
  const { userName } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClassRoom, setSelectedClassRoom] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userName) loadSubjects();
  }, [userName]);

  const loadSubjects = async () => {
    setLoading(true);
    const data = await ReservationService.getSubjects(userName!);
    setSubjects(data);
    setLoading(false);
  };

  const handleReserve = async () => {
    try {
      const payload = {
        userName: userName,
        subjectName: selectedSubject,
        reserveMeans: {}, 
        reserve: true
      };
      
      const res = await apiClient.post('/classroommeans/reserveClassRoomAndMeans', payload);
      
      if (res.data.isSuccess || res.data.success) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setStep(1); setSelectedSubject(''); }, 3000);
      } else {
        alert("El aula ya está ocupada o hubo un error: " + (res.data.error?.message || "Intenta con otra."));
      }
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert("Error al conectar con el servidor. Revisa la consola.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Reserva de Aulas y Medios</h1>
        <p className="text-slate-500 dark:text-slate-400">Sigue los pasos para reservar un espacio.</p>
      </div>

      {/* Barra de progreso */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-400 to-purple-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= num ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-600'
            }`}>
              {step > num ? <Check size={18} /> : num}
            </div>
            <span className={`text-xs font-semibold ${step >= num ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
              {num === 1 ? 'Asignatura' : num === 2 ? 'Aula' : num === 3 ? 'Medios' : 'Confirmar'}
            </span>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 min-h-[400px] flex flex-col justify-between dark:bg-slate-800/50 dark:border-slate-700">
        
        {/* PASO 1: Asignatura */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Selecciona una asignatura</h2>
            {loading ? (
              <p className="text-slate-500 dark:text-slate-400">Cargando asignaturas...</p>
            ) : subjects.length === 0 ? (
              <div className="text-center py-10">
                <BookOpen className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                <p className="text-slate-500 dark:text-slate-400">No tienes asignaturas asignadas para reservar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((sub: any) => (
                  <button
                    key={sub.idSub || sub.nameSub}
                    onClick={() => { setSelectedSubject(sub.nameSub); setStep(2); }}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedSubject === sub.nameSub ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-transparent bg-white/60 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-xl flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white text-center">{sub.nameSub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO 2: Aula */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Selecciona un Aula</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((id) => (
                <button
                  key={id}
                  onClick={() => { setSelectedClassRoom(id.toString()); setStep(3); }}
                  className="p-6 rounded-2xl border-2 border-transparent bg-white/60 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all flex flex-col items-start gap-2"
                >
                  <span className="font-bold text-slate-800 dark:text-white text-lg">Aula {id}</span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-md">Disponible</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 3: Medios */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Selecciona los Medios</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl">
                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                <label className="font-semibold text-slate-700 dark:text-slate-300">Proyector (2 disponibles)</label>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl">
                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                <label className="font-semibold text-slate-700 dark:text-slate-300">Pizarra Digital (3 disponibles)</label>
              </div>
            </div>
          </div>
        )}

        {/* PASO 4: Confirmar */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 flex flex-col items-center justify-center h-full">
            {success ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">¡Reserva Exitosa!</h2>
                <p className="text-slate-500 dark:text-slate-400">El aula y los medios han sido reservados.</p>
              </div>
            ) : (
              <div className="text-center w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Resumen de la Reserva</h2>
                <div className="bg-white/60 dark:bg-slate-700/50 p-6 rounded-2xl space-y-4 mb-8 text-left">
                  <p className="flex justify-between border-b border-slate-200 dark:border-slate-600 pb-2"><span className="text-slate-500 dark:text-slate-400">Asignatura:</span> <span className="font-bold text-slate-800 dark:text-white">{selectedSubject}</span></p>
                  <p className="flex justify-between border-b border-slate-200 dark:border-slate-600 pb-2"><span className="text-slate-500 dark:text-slate-400">Aula:</span> <span className="font-bold text-slate-800 dark:text-white">Aula {selectedClassRoom}</span></p>
                  <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Medios:</span> <span className="font-bold text-slate-800 dark:text-white">Proyector</span></p>
                </div>
                <button onClick={handleReserve} className="btn-lyra w-full py-4 text-lg">
                  Confirmar Reserva
                </button>
              </div>
            )}
          </div>
        )}

        {/* Botones de Navegación */}
        {!success && step < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1}
              className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 ${step === 1 ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            <button 
              onClick={() => setStep(step + 1)} 
              disabled={step === 1 && !selectedSubject}
              className={`btn-lyra px-6 py-2 flex items-center gap-2 ${step === 1 && !selectedSubject ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Siguiente <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}