import { FileText } from 'lucide-react';

export default function FacultyReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <FileText className="text-purple-600" size={32} /> Reportes de Facultad
        </h1>
        <p className="text-slate-700 dark:text-slate-400 mt-1">Panel exclusivo para el Decano.</p>
      </div>
      <div className="glass-card p-8 text-center dark:bg-slate-800/50">
        <p className="text-slate-600 dark:text-slate-400">Aquí se mostrarán los reportes globales de la facultad (próximamente).</p>
      </div>
    </div>
  );
}