using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Perfil del trabajador de mantenimiento (rol Maintenance).
/// </summary>
public class MaintenanceWorker : ISoftDeletable
{
    public int IdMaint { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string NameMaint { get; set; } = string.Empty;
    public int SalaryMaint { get; set; }
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;
    public bool IsDeleted { get; set; }
}