param([switch]$Install)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
foreach ($tool in @('dotnet', 'npm')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        throw "Falta $tool. Consulta docs/PRUEBAS.md para instalarlo."
    }
}
Push-Location $repoRoot
try {
    dotnet test ./ASP.Net-backend/SchoolManagement.Api.Tests/SchoolManagement.Api.Tests.csproj
    if ($LASTEXITCODE -ne 0) { throw 'Fallaron las pruebas del backend.' }
    Set-Location ./frontend
    if ($Install) {
        npm ci
        if ($LASTEXITCODE -ne 0) { throw 'Falló npm ci.' }
    }
    npm test
    if ($LASTEXITCODE -ne 0) { throw 'Fallaron las pruebas del frontend.' }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación del frontend.' }
    Write-Host 'Pruebas aisladas y compilación completadas. E2E y MySQL real se ejecutan por separado.'
} finally {
    Pop-Location
}
