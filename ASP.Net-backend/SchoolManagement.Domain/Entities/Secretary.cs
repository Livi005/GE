using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Relations;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Secretario/a del centro.
/// </summary>
public class Secretary : ISoftDeletable
{
    public int IdS { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string NameS { get; set; } = string.Empty;
    public int SalaryS { get; set; }
    public bool IsDeleted { get; set; }

    // Multi-tenant
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;

    public List<ProfessorStudentSubject> Evaluations { get; set; } = new();
}