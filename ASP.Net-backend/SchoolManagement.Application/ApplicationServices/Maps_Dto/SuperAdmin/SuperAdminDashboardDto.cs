using SchoolManagement.Application.ApplicationServices.Maps_Dto.Institution;

namespace SchoolManagement.Application.ApplicationServices.Maps_Dto.SuperAdmin;

public class SuperAdminDashboardDto
{
    public int TotalInstitutions { get; set; }
    public int TotalUsers { get; set; }
    public string Uptime { get; set; } = "99.9%";
    public List<InstitutionDto> Institutions { get; set; } = new();
}