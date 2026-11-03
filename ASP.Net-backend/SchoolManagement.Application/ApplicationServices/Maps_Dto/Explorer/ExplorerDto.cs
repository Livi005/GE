namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Explorer;

public class ExplorerTreeDto
{
    public List<ExplorerCourseDto> Courses { get; set; } = new();
    public List<ExplorerProfessorDto> Professors { get; set; } = new();
}

public class ExplorerCourseDto
{
    public int IdC { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public List<ExplorerSubjectDto> Subjects { get; set; } = new();
}

public class ExplorerSubjectDto
{
    public int IdSub { get; set; }
    public string NameSub { get; set; } = string.Empty;
    public string StudyProgram { get; set; } = string.Empty;
    public List<ExplorerStudentDto> Students { get; set; } = new();
}

public class ExplorerStudentDto
{
    public int IdStud { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int Age { get; set; }
    public int Absences { get; set; }
    public double Average { get; set; }
}

public class ExplorerProfessorDto
{
    public int IdProf { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Spec { get; set; } = string.Empty;
    public int Salary { get; set; }
    public double AverageRating { get; set; }
    public int Experience { get; set; }
}