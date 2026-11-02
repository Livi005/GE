import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
      <span className="text-sm text-slate-500">
        Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
      </span>
      <div className="flex gap-2 items-center">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/50 border border-slate-200 disabled:opacity-50 hover:bg-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-slate-700 px-2">Pág. {currentPage} de {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white/50 border border-slate-200 disabled:opacity-50 hover:bg-white transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}