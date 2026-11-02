import { useState } from 'react';
import { UserCog, Search, Plus, Edit2, Trash2, X, Shield, User, Mail, Key } from 'lucide-react';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Admin', institution: 'Colegio LYRA' });

  // Datos mockeados
  const [users, setUsers] = useState([
    { id: 1, name: 'María González', email: 'maria@lyra.edu', role: 'Admin', institution: 'Colegio LYRA', status: 'Activo' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos@sanjose.edu', role: 'Admin', institution: 'Instituto San José', status: 'Activo' },
    { id: 3, name: 'Ana Torres', email: 'ana@lyra.edu', role: 'Secretary', institution: 'Colegio LYRA', status: 'Activo' },
    { id: 4, name: 'Luis Gómez', email: 'luis@et4.edu', role: 'Admin', institution: 'Escuela Técnica 4', status: 'Inactivo' },
  ]);

  const filtered = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de guardado
    setUsers([...users, { id: Date.now(), ...formData, status: 'Activo' }]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'Admin', institution: 'Colegio LYRA' });
  };

  const handleDelete = (id: number) => {
    if(window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <UserCog className="text-blue-600 dark:text-blue-400" size={32} /> Gestión de Usuarios Globales
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Administra los accesos de administradores y secretarios en todas las instituciones.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-lyra px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Nuevo Usuario
        </button>
      </div>

      <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 dark:bg-slate-700/50 border border-white/50 dark:border-slate-600 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" 
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                <th className="py-4 px-4 font-semibold">Usuario</th>
                <th className="py-4 px-4 font-semibold">Email</th>
                <th className="py-4 px-4 font-semibold">Rol</th>
                <th className="py-4 px-4 font-semibold">Institución</th>
                <th className="py-4 px-4 font-semibold">Estado</th>
                <th className="py-4 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {u.role === 'Admin' ? 'Gestor de Recursos' : u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{u.institution}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-2 text-xs font-bold ${u.status === 'Activo' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${u.status === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right flex justify-end gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR USUARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative dark:bg-slate-800 dark:border-slate-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Shield size={24} className="text-purple-500"/> Nuevo Usuario</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/60 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/60 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="ejemplo@lyra.edu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/60 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white">
                    <option value="Admin">Gestor de Recursos</option>
                    <option value="Secretary">Secretaría</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Institución</label>
                  <select value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/60 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white">
                    <option value="Colegio LYRA">Colegio LYRA</option>
                    <option value="Instituto San José">Instituto San José</option>
                    <option value="Escuela Técnica 4">Escuela Técnica 4</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-white/50 dark:hover:bg-slate-700/50">Cancelar</button>
                <button type="submit" className="btn-lyra px-6 py-2 flex items-center gap-2"><Key size={18}/> Crear Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}