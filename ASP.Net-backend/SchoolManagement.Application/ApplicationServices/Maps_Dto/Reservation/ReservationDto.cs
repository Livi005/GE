namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Reservation;

public class ReservationDto
{
    public int IdReservation { get; set; }
    public int IdProf { get; set; }
    public int IdClassR { get; set; }
    public int IdSub { get; set; }
    public DateTime  Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string ProfessorName { get; set; } = string.Empty;
    public string ClassRoomLocation { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
}