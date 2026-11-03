import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Check, Monitor, School, AlertCircle } from 'lucide-react';
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
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userName) return;
    
    const loadData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        // 1. Cargar asignaturas del profesor
        const resSubs = await apiClient.get(`/professorStudentSubject/getsubjects?userName=${userName}`);
        const subs = resSubs.data?.value || resSubs.data || [];
        setSubjects(subs);

        // 2. Cargar aulas y medios disponibles
        const resAvail = await apiClient.get('/api/reservation/available');
        setClassRooms(resAvail.data.classRooms || []);
        setMeans([...(resAvail.data.techMeans || []), ...(resAvail.data.auxMeans || [])]);
      } catch (err: any) {
        console.error("Error cargando datos para reserva:", err);
        setErrorMsg("No se pudieron cargar los datos. " + (err.response?.data?.detail || "Revisa la consola."));
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
    setErrorMsg('');
    try {
      // Payload exacto según el Backend (ClassRoomMeanRequest)
      const payload = {
        userName: userName,
        subjectName: selectedSubject.nameSub,
        reserveMeans: {
          classRoomId: selectedClassRoom.idClassR,
          technologicalMeanIds: selectedMeans.filter(id => means.find(m => m.idMean === id && m.type === 'Tech')),
          auxiliaryMeanIds: selectedMeans.filter(id => means.find(m => m.idMean === id && m.type !== 'Tech'))
        },
        reserve: true // true = reservar, false = liberar
      };
      
      await apiClient.post('/classroommeans/reserveClassRoomAndMeans', payload);
      
      setSuccess(true);
      setTimeout(() => { 
        setSuccess(false); 
        setStep(1); 
        setSelectedSubject(null); 
        setSelectedClassRoom(null); 
        setSelectedMeans([]); 
      }, 3000);
      
    } catch (error: any) {
      setErrorMsg("Error al reservar: " + (error.response?.data?.detail || "El aula o medio ya está ocupado."));
    }
  };

  if (loading) return <LoadingState message="Cargando datos de reserva..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Reserva de Aulas y Medios</h1>
        <p className="text-slate-700 dark:text-slate-400 font-medium">Sigue los pasos para reservar un espacio.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-100 text-red-800 p-4 rounded-xl flex items-center gap-3 border border-red-200 shadow-sm font-bold">
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      {/* Barra de progreso */}
      <div className="flex items-center justify-between relative mt-8">
        <div className="absolute left-0 top-1/2 w-full h-1.5 bg-slate-300 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${
              step >= num ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' : 'bg-white text-slate-500 border-2 border-slate-300'
            }`}>
              {step > num ? <Check size={18} /> : num}
            </div>
            <span className={`text-xs font-bold ${step >= num ? 'text-slate-900' : 'text-slate-500'}`}>
              {num === 1 ? 'Asignatura' : num === 2 ? 'Aula' : num === 3 ? 'Medios' : 'Confirmar'}
            </span>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 min-h-[400px] flex flex-col justify-between">
        
        {/* PASO 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Selecciona una asignatura</h2>
            {subjects.length === 0 ? (
              <div className="text-center py-8 bg-orange-100 rounded-xl border border-orange-200">
                <p className="text-orange-800 font-bold mb-2">No tienes asignaturas asignadas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((sub: any) => (
                  <button
                    key={sub.idSub}
                    onClick={() => { setSelectedSubject(sub); setStep(2); }}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedSubject?.idSub === sub.idSub ? 'border-purple-600 bg-purple-50' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <span className="font-bold text-slate-900 text-center">{sub.nameSub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">2. Selecciona un Aula</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classRooms.map((room: any) => (
                <button
                  key={room.idClassR}
                  onClick={() => { setSelectedClassRoom(room); setStep(3); }}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-start gap-2 ${
                    selectedClassRoom?.idClassR === room.idClassR ? 'border-purple-600 bg-purple-50' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <School size={24} className="text-purple-600 mb-2" />
                  <span className="font-bold text-slate-900 text-lg">{room.location}</span>
                  <span className="text-xs font-bold text-green-800 bg-green-100 px-2 py-1 rounded-md border border-green-200">Capacidad: {room.capacity}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Selecciona los Medios (Opcional)</h2>
            <div className="space-y-3">
              {means.length === 0 ? (
                <p className="text-slate-700 font-medium">No hay medios disponibles en este momento.</p>
              ) : means.map((mean: any) => (
                <div key={mean.idMean} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedMeans.includes(mean.idMean)}
                    onChange={() => handleToggleMean(mean.idMean)}
                    className="w-5 h-5 text-purple-600 rounded cursor-pointer" 
                  />
                  <Monitor size={20} className="text-slate-500" />
                  <div>
                    <p className="font-bold text-slate-900">{mean.nameMean}</p>
                    <p className="text-xs text-slate-600 font-medium">{mean.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASO 4 */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 flex flex-col items-center justify-center h-full">
            {success ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Reserva Exitosa!</h2>
                <p className="text-slate-700 font-medium">El aula y los medios han sido reservados.</p>
              </div>
            ) : (
              <div className="text-center w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Resumen de la Reserva</h2>
                <div className="bg-white p-6 rounded-2xl space-y-4 mb-8 text-left border border-slate-200 shadow-sm">
                  <p className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-600 font-semibold">Asignatura:</span> <span className="font-bold text-slate-900">{selectedSubject?.nameSub}</span></p>
                  <p className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-600 font-semibold">Aula:</span> <span className="font-bold text-slate-900">{selectedClassRoom?.location}</span></p>
                  <p className="flex justify-between"><span className="text-slate-600 font-semibold">Medios:</span> <span className="font-bold text-slate-900">{selectedMeans.length} seleccionados</span></p>
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
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button onClick={() => setStep(step - 1)} disabled={step === 1} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${step === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'}`}>
              <ArrowLeft size={18} /> Atrás
            </button>
            <button onClick={() => setStep(step + 1)} disabled={(step === 1 && !selectedSubject) || (step === 2 && !selectedClassRoom)} className={`btn-lyra px-8 py-3 flex items-center gap-2 ${((step === 1 && !selectedSubject) || (step === 2 && !selectedClassRoom)) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>
              Siguiente <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}