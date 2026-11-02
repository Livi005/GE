import { useAuthStore } from '../store/authStore';

interface Props {
  message?: string;
  isError?: boolean;
}

export default function LoadingState({ message = 'Cargando información...', isError = false }: Props) {
  const { theme } = useAuthStore();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-[60vh] rounded-3xl relative overflow-hidden ${isDark ? 'dark' : ''}`}
      // Fondo C (Carga y estados vacíos)
      style={{ backgroundImage: isDark ? "url('/assets/fondo_carga_oscuro.jpg')" : "url('/assets/fondo_carga_claro.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <img 
          src="/assets/flor.png" 
          alt="LYRA" 
          className={`w-24 h-24 object-contain mb-6 ${!isError ? 'animate-pulse' : 'opacity-50 grayscale'}`} 
        />
        <p className={`text-lg font-bold ${isError ? 'text-red-500' : 'text-slate-700 dark:text-white'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}