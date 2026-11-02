namespace SchoolManagement.Infrastructure.Common.Tenant;

/// <summary>
/// Provee el InstitutionId del usuario autenticado.
/// Devuelve null cuando el usuario es SuperAdmin o no hay contexto (ej. seeds, migraciones).
/// </summary>
public interface ITenantProvider
{
    int? InstitutionId { get; }
    bool IsSuperAdmin { get; }
}