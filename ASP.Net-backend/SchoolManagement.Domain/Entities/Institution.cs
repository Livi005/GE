using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Institución educativa (colegio, liceo, instituto). Raíz del multi-tenant.
/// No lleva InstitutionId: es la tabla raíz.
/// </summary>
public class Institution : ISoftDeletable
{
    public int IdInstitution { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public InstitutionPlan Plan { get; set; } = InstitutionPlan.Trial;
    public InstitutionStatus Status { get; set; } = InstitutionStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }
}