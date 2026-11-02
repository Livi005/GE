namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Attendance;

public class AttendanceDto
{
    public int IdAttendance { get; set; }
    public int IdSub { get; set; }
    public int IdStud { get; set; }
    public DateTime  Date { get; set; }
    public int Status { get; set; }        // 0=Present, 1=Absent, 2=Late
    public string StudentName { get; set; } = string.Empty;
}

public class AttendanceSaveDto
{
    public int IdSub { get; set; }
    public DateTime  Date { get; set; }
    public List<AttendanceRecordDto> Records { get; set; } = new();
}

public class AttendanceRecordDto
{
    public int IdStud { get; set; }
    public int Status { get; set; }        // 0=Present, 1=Absent, 2=Late
}