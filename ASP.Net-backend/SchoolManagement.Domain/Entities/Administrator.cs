using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Administrador/Director del centro. Máxima autoridad de la institución.
/// </summary>
public class Administrator : ISoftDeletable
{
    public int AdminId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string AdminName { get; set; } = string.Empty;
    public int AdminSalary { get; set; }

    // Multi-tenant
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;

    public bool IsDeleted { get; set; }
}