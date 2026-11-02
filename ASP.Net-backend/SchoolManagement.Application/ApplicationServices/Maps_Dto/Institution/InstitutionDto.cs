namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Institution;

public class InstitutionDto
{
    public int IdInstitution { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int Plan { get; set; }            // 0=Trial, 1=Basic, 2=Premium
    public int Status { get; set; }          // 0=Active, 1=Inactive, 2=Suspended
    public int UsersCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastActive { get; set; }
}

public class CreateInstitutionDto
{
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int Plan { get; set; } = 0;
}