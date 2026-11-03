import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { LogIn, User, Lock, Eye, EyeOff, Users, BarChart3 } from 'lucide-react';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { theme } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/identity/login', { 
        userName: userName.trim(), 
        password: password 
      });
      
      const { token, role, userName: resUserName, isDean, institutionId, theme: resTheme } = response.data;
      
      if (token && role) {
        // Guardamos el theme que viene del backend (o 'light' por defecto)
        login(token, role, resUserName || userName.trim(), isDean || false, institutionId || null); 
        
        if (role === 'SuperAdmin') {
          navigate('/superadmin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
      {/* Panel Izquierdo - Branding */}
      <div 
        className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: isDark ? "url('/assets/fondo_acceso_oscuro.jpg')" : "url('/assets/fondo_acceso_claro.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img src="/assets/flor.png" alt="LYRA Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">LYRA</h1>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase">Gestión Educativa</p>
            </div>
          </div>

          <p className="text-sm font-bold text-blue-700 dark:text-blue-400 tracking-widest uppercase mb-4">Un gran día para aprender</p>
          <h2 className="text-5xl font-display font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            Cada flor que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 underline decoration-pink-400 decoration-4 underline-offset-4">florece</span><br />es una historia que inspira.
          </h2>
          <p className="text-lg text-slate-800 dark:text-slate-200 max-w-md font-medium">
            LYRA no es solo una plataforma, es el puente entre el conocimiento y el futuro que tus estudiantes merecen.
          </p>
        </div>

        <div className="relative z-10 mt-8 border-l-4 border-pink-500 pl-4">
          <p className="text-slate-800 dark:text-slate-300 italic font-bold">"Comunidades educativas que dejan huella."</p>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white/90 dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-slate-700 dark:text-slate-400 font-medium">Inicia sesión para continuar en LYRA.</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-900/50 flex items-center gap-2 font-bold">
              <span>Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all font-medium shadow-sm"
                  placeholder="ej. director.juan.gomez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all font-medium shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando...' : <><LogIn size={20} /> Entrar</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-700 dark:text-slate-400 font-medium">
            ¿No tienes una cuenta? <a href="#" className="font-bold text-blue-700 dark:text-blue-400 hover:underline">Contacta a tu institución.</a>
          </p>
        </div>
      </div>
    </div>
  );
}