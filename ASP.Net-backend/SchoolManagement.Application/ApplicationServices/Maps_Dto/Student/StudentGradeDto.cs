namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Student;

public class StudentGradeDto
{
    public int IdSub { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public float Grade { get; set; }
    public string TeacherName { get; set; } = string.Empty;
}