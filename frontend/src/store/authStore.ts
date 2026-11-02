import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string | null;
  userName: string | null;
  isDean: boolean;
  institutionId: number | null;
  theme: 'light' | 'dark';
  login: (token: string, role: string, userName: string, isDean: boolean, institutionId: number | null) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  userName: localStorage.getItem('userName'),
  isDean: localStorage.getItem('isDean') === 'true',
  institutionId: localStorage.getItem('institutionId') ? Number(localStorage.getItem('institutionId')) : null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  
  login: (token, role, userName, isDean, institutionId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userName', userName);
    localStorage.setItem('isDean', String(isDean));
    if (institutionId) localStorage.setItem('institutionId', String(institutionId));
    
    set({ token, role, userName, isDean, institutionId });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('isDean');
    localStorage.removeItem('institutionId');
    set({ token: null, role: null, userName: null, isDean: false, institutionId: null });
  },
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
}));