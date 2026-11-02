namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Notification;

public class CreateNotificationDto
{
    public string SenderUserName { get; set; } = string.Empty;
    public List<string> TargetRoles { get; set; } = new();   // "Student", "Professor", ...
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info";               // Info/Success/Warning/Danger
    public string? Module { get; set; }
}
