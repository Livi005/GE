namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

// ==================== STUDENT ====================
public class StudentDashboardDto
{
    public string StudentName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public List<GradeSummaryDto> Grades { get; set; } = new();
    public List<TodayScheduleItemDto> Schedule { get; set; } = new();
    public List<StudentProfessorDto> Professors { get; set; } = new();
    public double AverageGrade { get; set; }
    public int AttendancePercentage { get; set; }
}

public class GradeSummaryDto
{
    public string SubjectName { get; set; } = string.Empty;
    public float Grade { get; set; }
    public string TeacherName { get; set; } = string.Empty;
}

public class TodayScheduleItemDto
{
    public int IdSchedule { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;   // "08:00 - 09:30"
    public string Room { get; set; } = string.Empty;
    public string Type { get; set; } = "class";        // "class" | "lab" | "break"
}

public class StudentProfessorDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public double Rating { get; set; }
}

// ==================== PROFESSOR ====================
public class ProfessorDashboardDto
{
    public string ProfessorName { get; set; } = string.Empty;
    public int TotalSubjects { get; set; }
    public int TotalStudents { get; set; }
    public int PendingGrades { get; set; }
    public List<TodayClassDto> TodayClasses { get; set; } = new();
}

public class TodayClassDto
{
    public int IdSub { get; set; }
    public string NameSub { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public int Students { get; set; }
    public string NextClass { get; set; } = string.Empty;   // "08:00 - 09:30"
    public string Room { get; set; } = string.Empty;
}

// ==================== OTHER ====================
public class ClassRoomAvailabilityDto
{
    public int IdClassR { get; set; }
    public string Location { get; set; } = string.Empty;
}