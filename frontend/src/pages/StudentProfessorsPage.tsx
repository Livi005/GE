import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { GraduationCap, Star, X, CheckCircle, AlertCircle } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function StudentProfessorsPage() {
  const { userName } = useAuthStore();
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!userName) return;
    
    // Usamos el Dashboard del estudiante que sí trae la lista de profesores
    apiClient.get(`/dashboard/student/${userName}`)
      .then(res => {
        const data = res.data?.professors || [];
        setProfessors(data);
      })
      .catch(err => console.error("Error al cargar profesores:", err))
      .finally(() => setLoading(false));
  }, [userName]);

  const openEvaluation = (prof: any) => {
    setSelectedProf(prof);
    setRating(5); 
    setComment('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Usamos el endpoint correcto del backend
      await apiClient.post('/api/student/evaluate-professor', {
        studentUserName: userName,
        professorId: selectedProf.id || selectedProf.idProf,
        rating: rating, 
        comment: comment || "Sin comentario"
      });
      alert("¡Gracias por tu evaluación!");
      setIsModalOpen(false);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorMsg("Ya evaluaste a este profesor anteriormente.");
      } else {
        setErrorMsg("Error al enviar la evaluación: " + (err.response?.data?.detail || "Revisa la consola"));
      }
    }
  };

  if (loading) return <LoadingState message="Cargando tus profesores..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <GraduationCap className="text-purple-600" size={32} /> Mis Profesores
        </h1>
        <p className="text-slate-700 dark:text-slate-400 mt-1 font-medium">Conoce a tus docentes y evalúa su desempeño.</p>
      </div>

      {professors.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <AlertCircle size={48} className="text-orange-400 mb-4" />
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-2">No tienes profesores asignados actualmente.</p>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Si crees que es un error, contacta con la secretaría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((prof: any, idx: number) => (
            <div key={prof.id || prof.idProf || idx} className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-lg mb-4">
                {(prof.profName || prof.name)?.charAt(0) || 'P'}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{prof.profName || prof.name}</h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 font-medium mb-3">{prof.subjectName || prof.subject}</p>
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-slate-900 dark:text-white">{prof.rating ? prof.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <button onClick={() => openEvaluation(prof)} className="w-full py-2 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-xl font-bold hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 border border-purple-200">
                <Star size={16} /> Evaluar Docente
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Evaluación */}
      {isModalOpen && selectedProf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative bg-white/90 dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Evaluar Docente</h2>
            <p className="text-sm text-slate-700 dark:text-slate-400 font-bold mb-6">{selectedProf.profName || selectedProf.name} - {selectedProf.subjectName || selectedProf.subject}</p>
            
            {errorMsg && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitEvaluation} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-300">Calificación (1 a 5)</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)} 
                      className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600'}`}
                    >
                      <Star size={36} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-300">Comentario (opcional)</label>
                <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-700 font-bold bg-slate-200 hover:bg-slate-300 transition-colors">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2 flex items-center gap-2"><CheckCircle size={18}/> Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}