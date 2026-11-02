namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Schedule;

public class ScheduleDto
{
    public int IdSchedule { get; set; }
    public int IdSub { get; set; }
    public int IdProf { get; set; }
    public int IdClassR { get; set; }
    public int Day { get; set; }            // 0=Domingo ... 6=Sábado (DayOfWeek)
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }

    // Datos de solo lectura para el front
    public string SubjectName { get; set; } = string.Empty;
    public string ProfessorName { get; set; } = string.Empty;
    public string ClassRoomLocation { get; set; } = string.Empty;
}