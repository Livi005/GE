import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Shield, Bell, Lock, Moon, Sun, X, CheckCircle } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function SettingsPage() {
  const { theme, toggleTheme, userName, role } = useAuthStore();
  const [modalOpen, setModalOpen] = useState<'security' | 'notifications' | 'privacy' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [prefs, setPrefs] = useState({ emailNotifications: true, maintenanceAlerts: true });
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  useEffect(() => {
    if (!userName) return;
    apiClient.get(`/api/user/preferences/${userName}`)
      .then(res => {
        if (res.data) {
          setPrefs({ emailNotifications: res.data.emailNotifications, maintenanceAlerts: res.data.maintenanceAlerts });
          // Si el tema del back difiere del local, podríamos sincronizarlo aquí.
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userName]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put(`/identity/change-password?userName=${userName}`, { currentPassword: currentPass, newPassword: newPass });
      setPassMsg('Contraseña actualizada correctamente.');
      setCurrentPass(''); setNewPass('');
    } catch (error) {
      setPassMsg('Error al cambiar la contraseña.');
    }
  };

  const savePreferences = async () => {
    try {
      await apiClient.put(`/api/user/preferences/${userName}`, { theme, ...prefs });
      alert("Preferencias guardadas.");
    } catch (error) {
      alert("Error al guardar.");
    }
  };

  if (loading) return <LoadingState message="Cargando configuración..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Configuración</h1>
        <p className="text-slate-500 dark:text-slate-400">Ajustes generales de la cuenta y del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 md:col-span-2 flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-pink-500 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">{userName?.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{userName}</h2>
            <p className="text-slate-500 dark:text-slate-400">{role}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md"><CheckCircle size={12} /> Verificado</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start justify-between dark:bg-slate-800/50 dark:border-slate-700">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-xl flex items-center justify-center">{theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}</div>
            <div><h3 className="font-bold text-slate-800 dark:text-white">Apariencia</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Modo claro / oscuro.</p></div>
          </div>
          <button onClick={() => { toggleTheme(); savePreferences(); }} className={`w-14 h-8 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div onClick={() => setModalOpen('security')} className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform cursor-pointer dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-xl flex items-center justify-center"><Shield size={24} /></div>
          <div><h3 className="font-bold text-slate-800 dark:text-white">Seguridad</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cambiar contraseña.</p></div>
        </div>

        <div onClick={() => setModalOpen('notifications')} className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform cursor-pointer dark:bg-slate-800/50 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 rounded-xl flex items-center justify-center"><Bell size={24} /></div>
          <div><h3 className="font-bold text-slate-800 dark:text-white">Notificaciones</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Preferencias de avisos.</p></div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => { setModalOpen(null); setPassMsg(''); }} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            {modalOpen === 'security' && (
              <>
                <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">Cambiar Contraseña</h2>
                {passMsg && <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-4 text-sm">{passMsg}</div>}
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div><label className="block text-sm font-bold mb-1">Actual</label><input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" /></div>
                  <div><label className="block text-sm font-bold mb-1">Nueva</label><input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" /></div>
                  <button type="submit" className="btn-lyra w-full py-3 flex justify-center gap-2"><CheckCircle size={18}/> Guardar</button>
                </form>
              </>
            )}
            {modalOpen === 'notifications' && (
              <>
                <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">Notificaciones</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-sm font-medium">Avisos por Email</span>
                    <input type="checkbox" checked={prefs.emailNotifications} onChange={(e) => setPrefs({...prefs, emailNotifications: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-sm font-medium">Alertas de Mantenimiento</span>
                    <input type="checkbox" checked={prefs.maintenanceAlerts} onChange={(e) => setPrefs({...prefs, maintenanceAlerts: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
                  </div>
                  <button onClick={() => { savePreferences(); setModalOpen(null); }} className="btn-lyra w-full py-2 mt-4">Guardar Preferencias</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}