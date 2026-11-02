import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Bell, CheckCircle2, AlertCircle, Info, Check, Plus, X } from 'lucide-react';
import LoadingState from '../components/LoadingState';

export default function NotificationsPage() {
  const { userName } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newTarget, setNewTarget] = useState('Student');

  const fetchNotifications = async () => {
    if (!userName) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/notification/user/${userName}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error cargando notificaciones", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userName]);

  const markAllAsRead = async () => {
    try {
      await apiClient.put(`/notification/mark-read/${userName}`);
      fetchNotifications();
    } catch (err) {
      alert("Error al marcar notificaciones.");
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await apiClient.put(`/notification/mark-one-read/${id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/notification/create', {
        senderUserName: userName,
        targetRoles: [newTarget],
        title: newTitle,
        message: newMessage,
        type: "Info", // Enum correcto
        module: "general" // Añadido
      });
      setIsModalOpen(false);
      setNewTitle('');
      setNewMessage('');
      fetchNotifications();
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Error al enviar notificación.");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Success': return { Icon: CheckCircle2, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' };
      case 'Warning': return { Icon: AlertCircle, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' };
      default: return { Icon: Info, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
    }
  };

  if (loading) return <LoadingState message="Buscando notificaciones..." />;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
            Notificaciones
            {unreadCount > 0 && <span className="text-sm font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Avisos y alertas del sistema.</p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Check size={16} /> Marcar todas
            </button>
          )}
          <button onClick={() => setIsModalOpen(true)} className="btn-lyra px-4 py-2 flex items-center gap-2 text-sm">
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No tienes notificaciones pendientes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const { Icon, color } = getIcon(n.type);
              return (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 rounded-2xl border flex items-start gap-4 cursor-pointer transition-all ${
                    n.isRead 
                      ? 'bg-white/30 dark:bg-slate-800/30 border-transparent opacity-70' 
                      : 'bg-white/80 dark:bg-slate-700/50 border-white/80 dark:border-slate-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-sm ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-white'}`}>{n.title}</h4>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0"></span>}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">Nueva Notificación</h2>
            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Destinatario (Rol)</label>
                <select value={newTarget} onChange={(e) => setNewTarget(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white">
                  <option value="Student">Estudiantes</option>
                  <option value="Professor">Profesores</option>
                  <option value="Director">Directores</option>
                  <option value="Secretary">Secretaría</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Título</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Mensaje</label>
                <textarea rows={3} required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full px-4 py-2 rounded-xl border dark:bg-slate-700/50 dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}