import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';

function mount() { return render(<MemoryRouter initialEntries={['/login']}><Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={<h1>Panel privado</h1>} />
  <Route path="/superadmin" element={<h1>Panel global</h1>} />
</Routes></MemoryRouter>); }
async function submit() {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('ej. director.juan.gomez'), '  vivi.test  ');
  await user.type(screen.getByPlaceholderText('••••••••'), 'Test-only-pass1');
  await user.click(screen.getByRole('button', { name: /^Entrar$/ }));
}
describe('Login', () => {
  it.each(['Director', 'Secretary', 'Professor', 'Student', 'Maintenance', 'YearHead', 'SuperAdmin'])(
    'guarda la sesión y navega para %s', async (role) => {
      const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { token: 'test-token', role, userName: 'vivi.test', institutionId: role === 'SuperAdmin' ? null : 7, isDean: false } });
      mount(); await submit();
      expect(post).toHaveBeenCalledWith('/identity/login', { userName: 'vivi.test', password: 'Test-only-pass1' });
      expect(await screen.findByRole('heading', { name: role === 'SuperAdmin' ? 'Panel global' : 'Panel privado' })).toBeVisible();
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(useAuthStore.getState().role).toBe(role);
    });
  it('muestra credenciales incorrectas sin abrir sesión', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue({ response: { status: 401 } });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mount(); await submit();
    expect(await screen.findByText(/Usuario o contraseña incorrectos/)).toBeVisible();
    expect(useAuthStore.getState().token).toBeNull();
    expect(screen.queryByText('Panel privado')).not.toBeInTheDocument();
  });
  it('muestra un error de servidor y permite reintentar', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue({ response: { status: 500, data: { detail: 'Servicio temporalmente indisponible' } } });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mount(); await submit();
    expect(await screen.findByText('Servicio temporalmente indisponible')).toBeVisible();
    await waitFor(() => expect(screen.getByRole('button', { name: /^Entrar$/ })).toBeEnabled());
    expect(localStorage.getItem('token')).toBeNull();
  });
});
