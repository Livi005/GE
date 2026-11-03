import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { apiClient } from '../api/client';
import MaintenanceDashboard from '../pages/MaintenanceDashboard';
it('consulta la ruta real de mantenimiento y muestra sus datos', async () => {
  const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { totalClassRooms: 23, totalTechMeans: 4, totalAuxMeans: 5, pendingMaintenances: 2 } });
  render(<MaintenanceDashboard />);
  expect(await screen.findByText('23')).toBeVisible();
  expect(get).toHaveBeenCalledWith('/dashboard/maintenance');
  expect(screen.getByText('9')).toBeVisible();
});
it('distingue un fallo del servidor de un panel con ceros', async () => {
  vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('sin conexión'));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<MaintenanceDashboard />);
  expect(await screen.findByText('No se pudo cargar la información.')).toBeVisible();
  expect(screen.queryByText('Aulas Totales')).not.toBeInTheDocument();
});
