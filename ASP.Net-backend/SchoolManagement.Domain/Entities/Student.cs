using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Estudiante del centro. Incluye todos los campos del Wizard del frontend.
/// </summary>
public class Student : ISoftDeletable
{
    public int IdStud { get; set; }
    public string UserId { get; set; } = string.Empty;

    // Nombre
    public string Name1 { get; set; } = string.Empty;          // Nombre
    public string LastName1 { get; set; } = string.Empty;      // Primer apellido
    public string? LastName2 { get; set; }                     // Segundo apellido

    // Datos personales
    public DateTime BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;         // string libre (no enum)
    public string DocType { get; set; } = string.Empty;        // "DNI", "Pasaporte", ...
    public string DocNumber { get; set; } = string.Empty;

    // Contacto
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    // Académico
    public string Level { get; set; } = string.Empty;          // "Primaria", "Secundaria", ...
    public string Grade { get; set; } = string.Empty;          // "1ro", "2do", ...
    public string Section { get; set; } = string.Empty;        // "A", "B", ...
    public DateTime AdmissionDate { get; set; }
    public string AcademicYear { get; set; } = string.Empty;   // "2024-2025"
    public string InitialStatus { get; set; } = string.Empty;  // "Nuevo", "Repitente", ...
    public string? Notes { get; set; }

    // Tutor / emergencia
    public string? TutorName { get; set; }
    public string? TutorPhone { get; set; }
    public string? EmergencyContact { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; }

    // Curso (relación actual)
    public int IdC { get; set; }
    public Course Course { get; set; } = null!;

    // Multi-tenant
    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;

    // Navegación
    public List<Subject> Subjects { get; set; } = new();
    public List<Professor> Professors { get; set; } = new();
}