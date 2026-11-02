namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

public class MaintenanceDashboardDto
{
    public int TotalClassRooms { get; set; }
    public int TotalTechMeans { get; set; }
    public int TotalAuxMeans { get; set; }
    public int TotalMaintenances { get; set; }
    public int PendingMaintenances { get; set; }
    public List<MaintenanceBriefDto> RecentMaintenances { get; set; } = new();
}

public class MaintenanceBriefDto
{
    public int Id { get; set; }
    public string MeanName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Cost { get; set; }
}