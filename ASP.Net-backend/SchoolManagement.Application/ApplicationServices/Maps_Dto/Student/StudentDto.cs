namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Student;

public class StudentDto
{
    // Nombre
    public string Name1 { get; set; } = string.Empty;
    public string LastName1 { get; set; } = string.Empty;
    public string? LastName2 { get; set; }

    // Datos personales
    public DateTime BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string DocType { get; set; } = string.Empty;
    public string DocNumber { get; set; } = string.Empty;

    // Contacto
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    // Académico
    public string Level { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public DateTime AdmissionDate { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public string InitialStatus { get; set; } = string.Empty;
    public string? Notes { get; set; }

    // Tutor / emergencia
    public string? TutorName { get; set; }
    public string? TutorPhone { get; set; }
    public string? EmergencyContact { get; set; }

    public bool IsActive { get; set; } = true;
    public int IdC { get; set; }
}