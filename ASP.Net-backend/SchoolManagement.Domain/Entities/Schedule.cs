using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Bloque de horario: asignatura + profesor + aula + día + hora inicio/fin.
/// </summary>
public class Schedule : ISoftDeletable
{
    public int IdSchedule { get; set; }
    public int IdSub { get; set; }
    public Subject Subject { get; set; } = null!;
    public int IdProf { get; set; }
    public Professor Professor { get; set; } = null!;
    public int IdClassR { get; set; }
    public ClassRoom ClassRoom { get; set; } = null!;
    public DayOfWeek Day { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }    public bool IsDeleted { get; set; }
}