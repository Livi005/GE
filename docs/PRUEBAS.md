# Pruebas automáticas de GE — primer bloque

Base revisada: commit `7dfe67b`. Alcance: login, permisos HTTP y paneles.

## Qué verifica cada suite

| Suite | Ejecución | Dependencias reales | Qué NO demuestra |
| --- | --- | --- | --- |
| API: 20 casos | xUnit + WebApplicationFactory | Controllers, routing, JWT, autorización, serialización y middleware | Credenciales en Identity, consultas o persistencia MySQL: los servicios se sustituyen |
| Frontend: 16 casos | Vitest + React Testing Library | Componentes React, formularios, navegación y estado de sesión | Disponibilidad de la API: se sustituye el cliente HTTP |
| Flujo completo: 7 casos preparados | Playwright Chromium | Navegador, frontend, API y BD del entorno de prueba | Aún no ejecutados; requieren servidores y siete cuentas reales |

Los tests HTTP usan el entorno `Testing`, que evita la inicialización de BD de `Development`. Sustituyen los servicios de identidad, paneles y auditoría. Resolver un `Context` de BD produce un error deliberado antes de abrir una conexión. Los tokens se firman y validan de verdad con una clave exclusiva de pruebas. Estas pruebas no cubren aún aislamiento entre instituciones ni propiedad de datos por usuario.

## Preparar Windows

1. Abre VS Code en la carpeta raíz `GE` y selecciona **Terminal → New Terminal** (PowerShell).
2. Comprueba las herramientas:

```powershell
dotnet --list-sdks
node --version
npm --version
```

Necesitas **SDK .NET 10** (no solo Runtime) y **Node.js 22.12 o posterior compatible con Vite**. Descargas: https://dotnet.microsoft.com/download/dotnet/10.0 y https://nodejs.org/en/download . Tras instalar, cierra y abre VS Code.

3. Desde la raíz de GE, instala el frontend y ejecuta los controles:

```powershell
dotnet test .\ASP.Net-backend\SchoolManagement.Api.Tests\SchoolManagement.Api.Tests.csproj
Set-Location .\frontend
npm ci
npm test
npm run build
```

No necesitas iniciar MySQL ni la API para estos 36 casos aislados. El proyecto de pruebas se invoca por su ruta; todavía no está añadido a la solución antigua.

Alternativa desde la raíz, sin cambiar la política de ejecución de PowerShell:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Test-GE.ps1 -Install
```

`-Install` ejecuta `npm ci`; en siguientes ejecuciones puedes omitirlo. El script detiene el proceso si un control falla.

## Durante el desarrollo

En `frontend`, `npm run test:watch` vuelve a ejecutar pruebas al guardar. Cada error corregido debería añadir un caso que falle antes de la corrección y pase después. Un test fallido conserva la expectativa correcta; no se cambia para aceptar el error.

GitHub Actions contiene dos trabajos: pruebas HTTP y pruebas/compilación del frontend. Se ejecutarán al subir una rama o abrir un PR. La ejecución local no demuestra que el workflow remoto haya pasado. El informe `.trx` del backend se adjunta incluso si falla.

## Flujo completo en navegador (pendiente de ejecución)

Usa una copia aislada de la BD, datos ficticios y cuentas representativas con relaciones válidas (profesor, estudiante, curso e institución). Deben existir cuentas para Director, Secretary, Professor, Student, Maintenance, YearHead y SuperAdmin. No uses la BD ni cuentas de producción. El indicador siguiente es una confirmación del operador, no una detección automática de que la BD esté aislada.

Inicia API y frontend en terminales separadas con la conexión de BD de pruebas configurada en tu entorno local. No guardes contraseñas en Git.

```powershell
# Terminal 1, desde GE: establece TU conexión de pruebas antes de iniciar.
$env:ConnectionStrings__DefaultConnection = "CONEXION_MYSQL_DE_PRUEBAS"
dotnet run --project .\ASP.Net-backend\SchoolManagement.Api --launch-profile http
```

El perfil `http` usa `Development` y ejecuta la inicialización existente: por eso la conexión debe apuntar a una BD exclusiva de pruebas ANTES de arrancar. Para crear las siete cuentas, usa el procedimiento administrativo de tu instalación; esta entrega no añade un seed de usuarios.

```powershell
# Terminal 2, desde GE
Set-Location .\frontend
npm run dev -- --host localhost --port 5173 --strictPort
```

```powershell
# Terminal 3, desde GE/frontend
npx playwright install chromium
$env:GE_E2E_TEST_ENV = "true"
$env:GE_E2E_WEB_URL = "http://localhost:5173"
$env:GE_E2E_API_URL = "http://localhost:5164"
$env:GE_E2E_DIRECTOR_USER = "USUARIO_DIRECTOR_DE_PRUEBA"
$env:GE_E2E_DIRECTOR_PASSWORD = "CLAVE_DE_PRUEBA"
# Repite USER y PASSWORD para SECRETARY, PROFESSOR, STUDENT,
# MAINTENANCE, YEARHEAD y SUPERADMIN, sustituyendo DIRECTOR en el nombre.
npm run test:e2e
```

Para ejecutar un solo rol mientras preparas las demás cuentas:

```powershell
npm run test:e2e -- --grep "panel: Director$"
```

Estos casos no simulan respuestas. Exigen login, una consulta HTTP 200 al endpoint del panel, JSON, título visible, ausencia de excepciones JavaScript y conservación de la sesión al recargar. Si falta una cuenta, fallan explícitamente; no se omiten silenciosamente. Las trazas de fallos pueden contener datos y tokens de las cuentas ficticias: se ignoran en Git.

**Fallo conocido:** `YearHeadDashboard.tsx` aún muestra un panel estático sin llamar al endpoint de año. Su caso E2E debe fallar por ausencia de petición hasta que se conecte esa función. Se mantiene para impedir que una pantalla estática pase como flujo real comprobado.

## Resultado de esta entrega

- Backend: 20/20 pruebas HTTP pasaron localmente.
- Frontend: 16/16 pruebas pasaron localmente; TypeScript y compilación Vite pasaron.
- Playwright: descubrimiento de los 7 casos comprobado; recorridos no ejecutados por falta de BD/cuentas de prueba.
- Correcciones pequeñas verificadas: ruta `/dashboard/maintenance` y el import `./App` compatible con la configuración TypeScript.
- NuGet avisó de vulnerabilidades preexistentes en dependencias transitivas (AutoMapper y Pkcs); actualización fuera del alcance de este bloque. Vite avisó del tamaño del bundle.

## Próximo bloque

Integración MySQL real en una BD desechable: migraciones, registro y login real de Identity, crear/consultar estudiante, restricciones de relaciones y acceso entre instituciones. Después: calificaciones, asistencia, evaluaciones y reservas. Cada prueba deberá controlar sus datos para ser repetible y no depender del orden de ejecución.
