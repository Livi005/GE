using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;

namespace SchoolManagement.Domain.Notifications;

public class MeanNotification : IEntity
{
    public int MeanNotId { get; set; }
    public int IdMean { get; set; }
    public string MeanName { get; set; } = string.Empty;
    public string MeanType { get; set; } = string.Empty;
    public bool BeenSended { get; set; }

    public int IdInstitution { get; set; }
    public Institution Institution { get; set; } = null!;
}