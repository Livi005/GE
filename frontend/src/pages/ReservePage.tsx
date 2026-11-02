import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { ClassRoomService } from '../services/classroom.service';
import { MeansService } from '../services/means.service';
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Check, Monitor, School } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function ReservePage() {
  const { userName } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classRooms, setClassRooms] = useState<any[]>([]);
  const [means, setMeans] = useState<any[]>([]);
  
  const [step, setStep] = useState(1);
  
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedClassRoom, setSelectedClassRoom] = useState<any>(null);
  const [selectedMeans, setSelectedMeans] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userName) return;
    
    // Cargar datos reales
    const loadData = async () => {
      setLoading(true);
      try {
        const subs = await apiClient.get(`/professorStudentSubject/getsubjects?userName=${userName}`).then(r => r.data?.value || r.data || []);
        const rooms = await ClassRoomService.getAll();
        const techMeans = await MeansService.getTechnological();
        const auxMeans = await MeansService.getAuxiliary();
        
        setSubjects(subs);
        setClassRooms(rooms.filter((r: any) => r.isAviable)); // Solo disponibles
        setMeans([...techMeans, ...auxMeans].filter((m: any) => m.isAviable));
      } catch (err) {
        console.error("Error cargando datos para reserva:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userName]);

  const handleToggleMean = (id: number) => {
    if (selectedMeans.includes(id)) setSelectedMeans(selectedMeans.filter(m => m !== id));
    else setSelectedMeans([...selectedMeans, id]);
  };

  const handleReserve = async () => {
    try {
      // El Backend espera el payload exacto para crear la reserva
      const payload = {
        userName: userName,
        idSub: selectedSubject.idSub,
        idClassR: selectedClassRoom.idClassR,
        means: selectedMeans,
        reserve: true
      };
      
      // NOTA: El endpoint puede variar según el Backend. Usamos el que dice el informe.
      const res = await apiClient.post('/classroommeans/reserveClassRoomAndMeans', payload);
      
      // Según el informe, el backend devuelve un resultado directo o un error
      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setStep(1); setSelectedSubject(null); setSelectedClassRoom(null); setSelectedMeans([]); }, 3000);
      }
    } catch (error: any) {
      alert("Error al reservar: " + (error.response?.data?.detail || "El aula o medio ya está ocupado."));
    }
  };

  if (loading) return <LoadingState message="Cargando datos de reserva..." />;

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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">1. Selecciona una asignatura</h2>
            {subjects.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No tienes asignaturas asignadas.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((sub: any) => (
                  <button
                    key={sub.idSub}
                    onClick={() => { setSelectedSubject(sub); setStep(2); }}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedSubject?.idSub === sub.idSub ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-transparent bg-white/60 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">2. Selecciona un Aula</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classRooms.map((room: any) => (
                <button
                  key={room.idClassR}
                  onClick={() => { setSelectedClassRoom(room); setStep(3); }}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-start gap-2 ${
                    selectedClassRoom?.idClassR === room.idClassR ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-transparent bg-white/60 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
                  }`}
                >
                  <School size={24} className="text-purple-500 mb-2" />
                  <span className="font-bold text-slate-800 dark:text-white text-lg">{room.location}</span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-md">Capacidad: {room.capacity}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 3: Medios */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">3. Selecciona los Medios</h2>
            <div className="space-y-3">
              {means.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No hay medios disponibles en este momento.</p>
              ) : means.map((mean: any) => (
                <div key={mean.idMean} className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-transparent hover:border-purple-200 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedMeans.includes(mean.idMean)}
                    onChange={() => handleToggleMean(mean.idMean)}
                    className="w-5 h-5 text-purple-600 rounded cursor-pointer" 
                  />
                  <Monitor size={20} className="text-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{mean.nameMean}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{mean.state} • {mean.type || 'Tecnológico'}</p>
                  </div>
                </div>
              ))}
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
                  <p className="flex justify-between border-b border-slate-200 dark:border-slate-600 pb-2"><span className="text-slate-500 dark:text-slate-400">Asignatura:</span> <span className="font-bold text-slate-800 dark:text-white">{selectedSubject?.nameSub}</span></p>
                  <p className="flex justify-between border-b border-slate-200 dark:border-slate-600 pb-2"><span className="text-slate-500 dark:text-slate-400">Aula:</span> <span className="font-bold text-slate-800 dark:text-white">{selectedClassRoom?.location}</span></p>
                  <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Medios:</span> <span className="font-bold text-slate-800 dark:text-white">{selectedMeans.length} seleccionados</span></p>
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
              disabled={(step === 1 && !selectedSubject) || (step === 2 && !selectedClassRoom)}
              className={`btn-lyra px-6 py-2 flex items-center gap-2 ${((step === 1 && !selectedSubject) || (step === 2 && !selectedClassRoom)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Siguiente <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}