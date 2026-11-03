import { test, expect } from '@playwright/test';
// Requiere servidores y cuentas reales en un entorno aislado. No simula la API.
const roles = [
  ['Director', '/dashboard/admin'], ['Secretary', '/dashboard/secretary'],
  ['Professor', '/dashboard/professor/'], ['Student', '/dashboard/student/'],
  ['Maintenance', '/dashboard/maintenance'], ['YearHead', '/dashboard/yearhead/'],
  ['SuperAdmin', '/api/superadmin/dashboard'],
] as const;
for (const [role, endpoint] of roles) {
  test(`login y consulta real del panel: ${role}`, async ({ page }) => {
    if (process.env.GE_E2E_TEST_ENV !== 'true') throw new Error('Usa un entorno aislado y define GE_E2E_TEST_ENV=true.');
    const prefix = `GE_E2E_${role.toUpperCase()}`;
    const username = process.env[`${prefix}_USER`]; const password = process.env[`${prefix}_PASSWORD`];
    if (!username || !password) throw new Error(`Faltan ${prefix}_USER y ${prefix}_PASSWORD para una cuenta de prueba.`);
    const browserErrors: string[] = []; page.on('pageerror', e => browserErrors.push(e.message));
    await page.goto('/login');
    await page.getByPlaceholder('ej. director.juan.gomez').fill(username);
    await page.getByPlaceholder('••••••••').fill(password);
    const apiURL = process.env.GE_E2E_API_URL || 'http://localhost:5164';
    const responsePromise = page.waitForResponse(r => {
      const url = new URL(r.url());
      return url.origin === new URL(apiURL).origin && url.pathname.startsWith(endpoint) && r.request().method() === 'GET';
    });
    await page.getByRole('button', { name: /^Entrar$/ }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    await expect(page).toHaveURL(role === 'SuperAdmin' ? /\/superadmin$/ : /\/dashboard$/);
    await expect(page.locator('main h1')).toBeVisible();
    expect(browserErrors).toEqual([]);
    const reloadResponse = page.waitForResponse(r => new URL(r.url()).pathname.startsWith(endpoint) && r.request().method() === 'GET');
    await page.reload();
    expect((await reloadResponse).status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    expect(browserErrors).toEqual([]);
    await expect(page).toHaveURL(role === 'SuperAdmin' ? /\/superadmin$/ : /\/dashboard$/);
  });
}
