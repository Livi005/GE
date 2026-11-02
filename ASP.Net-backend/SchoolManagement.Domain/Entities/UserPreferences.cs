using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Preferencias visuales y de notificación de un usuario.
/// </summary>
public class UserPreferences : IEntity
{
    public int IdPreferences { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Theme { get; set; } = "light";          // "light" | "dark"
    public bool EmailNotifications { get; set; } = true;
    public bool MaintenanceAlerts { get; set; } = true;
}