namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Preferences;

public class UserPreferencesDto
{
    public string Theme { get; set; } = "light";
    public bool EmailNotifications { get; set; } = true;
    public bool MaintenanceAlerts { get; set; } = true;
}