using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Clase base abstracta para los medios (recursos) del centro.
/// </summary>
public abstract class Mean : ISoftDeletable
{
    public int IdMean { get; set; }
    public bool IsAviable { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; }
    public string NameMean { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;

    // Multi-tenant
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;

    public List<Maintenance> Maintenances { get; set; } = new();
}