using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Reserva de aula (y opcionalmente medios) por un profesor para una asignatura y fecha/hora.
/// </summary>
public class Reservation : ISoftDeletable
{
    public int IdReservation { get; set; }
    public int IdProf { get; set; }
    public Professor Professor { get; set; } = null!;
    public int IdClassR { get; set; }
    public ClassRoom ClassRoom { get; set; } = null!;
    public int IdSub { get; set; }
    public Subject Subject { get; set; } = null!;
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsDeleted { get; set; }
    public List<TechnologicalMeans> Means { get; set; } = new();
}