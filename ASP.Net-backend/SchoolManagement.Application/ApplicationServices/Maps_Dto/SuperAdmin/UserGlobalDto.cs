namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.SuperAdmin;

public class UserGlobalDto
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? InstitutionId { get; set; }
    public string InstitutionName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class CreateUserGlobalDto
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? InstitutionId { get; set; }
}

public class UpdateUserGlobalDto
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? InstitutionId { get; set; }
}