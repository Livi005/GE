using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Restricción aplicable a un aula.
/// </summary>
public class Restriction : ISoftDeletable
{
    public int IdRes { get; set; }
    public bool IsDeleted { get; set; }
    public string NameRes { get; set; } = string.Empty;

    // Multi-tenant
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;

    public List<ClassRoom> ClassRooms { get; set; } = new();
}