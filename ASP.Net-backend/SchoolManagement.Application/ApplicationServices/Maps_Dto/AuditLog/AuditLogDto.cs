namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.AuditLog;

public class AuditLogDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string? Ip { get; set; }
    public DateTime Date { get; set; }
    public string Type { get; set; } = "Info";
}