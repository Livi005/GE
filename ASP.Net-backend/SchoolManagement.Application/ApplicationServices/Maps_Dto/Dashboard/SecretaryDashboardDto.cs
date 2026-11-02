namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

public class SecretaryDashboardDto
{
    public int NewEnrollments { get; set; }
    public int PendingTrámites { get; set; }
    public int NewStudents { get; set; }
    public int TotalActiveStudents { get; set; }
    public int TotalInactiveStudents { get; set; }
    public List<NotificationBriefDto> Notifications { get; set; } = new();
    public List<EventBriefDto> UpcomingDeadlines { get; set; } = new();
}