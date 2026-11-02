namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

public class YearHeadDashboardDto
{
    public string YearHeadName { get; set; } = string.Empty;
    public int TotalCourses { get; set; }
    public int TotalSubjects { get; set; }
    public int TotalStudents { get; set; }
    public List<YearHeadCourseDto> Courses { get; set; } = new();
}

public class YearHeadCourseDto
{
    public int IdC { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public int StudentCount { get; set; }
}