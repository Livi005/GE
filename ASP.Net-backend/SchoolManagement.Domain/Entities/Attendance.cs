using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Registro de asistencia de un estudiante en una asignatura y fecha.
/// </summary>
public class Attendance : IEntity
{
    public int IdAttendance { get; set; }
    public int IdSub { get; set; }
    public Subject Subject { get; set; } = null!;
    public int IdStud { get; set; }
    public Student Student { get; set; } = null!;
    public DateTime Date { get; set; }
    public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;
}