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
      
      const { token, role, userName: resUserName, isDean, institutionId } = response.data;
      
      if (token && role) {
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
      {/* Panel Izquierdo - Branding (Fondo A) */}
      <div 
        className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: isDark ? "url('/assets/fondo_acceso_oscuro.jpg')" : "url('/assets/fondo_acceso_claro.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img src="/assets/flor.png" alt="LYRA Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-display font-extrabold text-slate-800 dark:text-white tracking-tight">LYRA</h1>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Gestión Educativa</p>
            </div>
          </div>

          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">Un gran día para aprender</p>
          <h2 className="text-5xl font-display font-extrabold text-slate-800 dark:text-white leading-tight mb-6">
            Cada flor que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 underline decoration-pink-400 decoration-4 underline-offset-4">florece</span><br />es una historia que inspira.
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-200 max-w-md font-light">
            LYRA no es solo una plataforma, es el puente entre el conocimiento y el futuro que tus estudiantes merecen.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 max-w-md">
          <div className="flex items-center gap-4 bg-white/40 dark:bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/50 dark:border-white/10">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400"><Users size={24} /></div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Comunidades conectadas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Estudiantes, docentes y familias en un solo lugar.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/40 dark:bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/50 dark:border-white/10">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400"><BarChart3 size={24} /></div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Gestión más simple</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Ahorra tiempo y enfócate en lo importante.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 border-l-4 border-pink-400 pl-4">
          <p className="text-slate-700 dark:text-slate-300 italic font-medium">"Comunidades educativas que dejan huella."</p>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <img src="/assets/flor.png" alt="LYRA Logo" className="w-16 h-16 object-contain lg:hidden" />
            </div>
            <h2 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-slate-500 dark:text-slate-400">Inicia sesión para continuar en LYRA.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                  placeholder="ej. director.juan.gomez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Recordarme</span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando...' : <><LogIn size={20} /> Entrar</>}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-sm text-slate-400">o</span>
          </div>

          <button type="button" className="w-full py-3.5 flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-semibold">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar con Google
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            ¿No tienes una cuenta? <a href="#" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">Contacta a tu institución.</a>
          </p>
        </div>
      </div>
    </div>
  );
}