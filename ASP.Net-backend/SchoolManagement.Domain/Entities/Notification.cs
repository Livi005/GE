using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Notificación genérica dirigida a un usuario concreto.
/// </summary>
public class Notification : IEntity
{
    public int IdNotification { get; set; }
    public string UserId { get; set; } = string.Empty;         // destinatario (Identity User.Id)
    public string? SenderUserId { get; set; }                  // emisor (opcional)
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; } = NotificationType.Info;
    public string? Module { get; set; }                        // "students", "grades", ...
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}