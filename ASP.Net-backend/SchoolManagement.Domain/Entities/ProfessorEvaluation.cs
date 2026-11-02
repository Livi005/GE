using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Evaluación que un estudiante hace a un profesor (rating 1–5 + comentario).
/// </summary>
public class ProfessorEvaluation : IEntity
{
    public int IdEval { get; set; }
    public int IdProf { get; set; }
    public Professor Professor { get; set; } = null!;
    public int IdStud { get; set; }
    public Student Student { get; set; } = null!;
    public int Rating { get; set; }               // 1–5
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}