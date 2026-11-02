namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

public class AdminDashboardDto
{
    public int TotalStudents { get; set; }
    public int TotalProfessors { get; set; }
    public int TotalSubjects { get; set; }
    public int TotalRooms { get; set; }
    public int TotalCourses { get; set; }
    public int TotalSubjectsWithGrades { get; set; }
    public double AverageGrade { get; set; }
    public int TotalNotifications { get; set; }
    public List<WeeklyAttendanceDto> WeeklyAttendance { get; set; } = new();
    public List<NotificationBriefDto> Notifications { get; set; } = new();
    public List<EventBriefDto> Events { get; set; } = new();
    public RiskStudentsDto RiskStudents { get; set; } = new();
    public List<TopStudentDto> TopStudents { get; set; } = new();
}

public class WeeklyAttendanceDto
{
    public string Day { get; set; } = string.Empty;
    public int Value { get; set; }
}

public class NotificationBriefDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info";
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

public class EventBriefDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Type { get; set; } = "Info";
}

public class RiskStudentsDto
{
    public int High { get; set; }
    public int Medium { get; set; }
    public int Low { get; set; }
    public int Total { get; set; }
}

public class TopStudentDto
{
    public int IdStud { get; set; }
    public string FullName { get; set; } = string.Empty;
    public double Average { get; set; }
}