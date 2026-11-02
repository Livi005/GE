using SchoolManagement.Domain.Common;

namespace SchoolManagement.Domain.Entities;

/// <summary>
/// Entrada de auditoría de acciones críticas.
/// </summary>
public class AuditLog : IEntity
{
    public int IdLog { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string? Ip { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public AuditLogType Type { get; set; } = AuditLogType.Info;
}