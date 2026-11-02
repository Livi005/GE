using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Curso académico (año escolar).
/// </summary>
public class Course : ISoftDeletable
{
    public int IdC { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }

    // Multi-tenant
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;

    public List<Student> Students { get; set; } = new();
}