using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace SchoolManagement.Infrastructure.Common.Tenant;

/// <summary>
/// Implementación de ITenantProvider que lee los claims del JWT.
/// Requiere que el token incluya: "institutionId" (int) y "role" (string).
/// </summary>
public class HttpTenantProvider : ITenantProvider
{
    private const string InstitutionClaim = "institutionId";
    private const string SuperAdminRole = "SuperAdmin";

    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpTenantProvider(IHttpContextAccessor httpContextAccessor)
        => _httpContextAccessor = httpContextAccessor;

    public int? InstitutionId
    {
        get
        {
            var raw = _httpContextAccessor.HttpContext?.User?
                .FindFirstValue(InstitutionClaim);
            return int.TryParse(raw, out var id) ? id : null;
        }
    }

    public bool IsSuperAdmin
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user is null) return false;
            return user.IsInRole(SuperAdminRole);
        }
    }
}