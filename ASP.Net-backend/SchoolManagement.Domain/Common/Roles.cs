namespace SchoolManagement.Domain.Common;

/// <summary>
/// Nombres de los roles del sistema.
/// Se usan como constantes para evitar strings mágicos en [Authorize(Roles = ...)] y en Identity.
/// SuperAdmin es un superset de Director + Maintenance: puede hacer todo lo que ellos hacen.
/// </summary>
public static class Roles
{
    /// <summary>Dueño de la plataforma. Global, sin institución. Ve y hace todo.</summary>
    public const string SuperAdmin = "SuperAdmin";

    /// <summary>Máxima autoridad del colegio. Ve y gestiona todo lo de su institución.</summary>
    public const string Director = "Director";

    /// <summary>Gestor de Recursos / Mantenimiento. Aulas y medios de su institución.</summary>
    public const string Maintenance = "Maintenance";

    /// <summary>Secretaría Académica. Matrículas, expedientes, certificados.</summary>
    public const string Secretary = "Secretary";

    /// <summary>Docente. Notas y asistencia de sus asignaturas.</summary>
    public const string Professor = "Professor";

    /// <summary>Estudiante. Consulta notas, horario, profesores. Evalúa docentes.</summary>
    public const string Student = "Student";

    /// <summary>Jefe de Año. Plan de estudios y horarios del año.</summary>
    public const string YearHead = "YearHead";

    /// <summary>Todos los roles existentes. Útil para seeds y comprobaciones.</summary>
    public static readonly IReadOnlyList<string> All = new[]
    {
        SuperAdmin, Director, Maintenance, Secretary, Professor, Student, YearHead
    };
}