namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

public class StudentDashboardDto
{
    public string StudentName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public List<GradeSummaryDto> Grades { get; set; } = new();
}

public class GradeSummaryDto
{
    public string SubjectName { get; set; } = string.Empty;
    public float Grade { get; set; }
}

public class ProfessorDashboardDto
{
    public string ProfessorName { get; set; } = string.Empty;
    public int TotalSubjects { get; set; }
    public int TotalStudents { get; set; }
    public int PendingGrades { get; set; }
}

public class ClassRoomAvailabilityDto
{
    public int IdClassR { get; set; }
    public string Location { get; set; } = string.Empty;
}