namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.ProfessorEvaluation;

public class ProfessorEvaluationDto
{
    public string StudentUserName { get; set; } = string.Empty;
    public int ProfessorId { get; set; }
    public int Rating { get; set; }          // 1–5
    public string? Comment { get; set; }
}

public class ProfessorEvaluationResponseDto
{
    public int IdEval { get; set; }
    public string ProfessorName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}