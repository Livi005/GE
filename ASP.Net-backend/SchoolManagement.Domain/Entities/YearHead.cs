using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Perfil del Jefe de Año (rol YearHead). Gestiona el plan de estudios y horarios del año.
/// </summary>
public class YearHead : ISoftDeletable
{
    public int IdYearHead { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string NameYearHead { get; set; } = string.Empty;
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;
    public bool IsDeleted { get; set; }
}