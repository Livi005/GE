using SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IDashboardService
{
    Task<Result<StudentDashboardDto>> GetStudentDashboardAsync(string userName);
    Task<Result<ProfessorDashboardDto>> GetProfessorDashboardAsync(string userName);
    Task<Result<IReadOnlyList<ClassRoomAvailabilityDto>>> GetAvailableClassRoomsAsync();
    Task<Result<AdminDashboardDto>> GetAdminDashboardAsync(CancellationToken cancellationToken = default);
    Task<Result<SecretaryDashboardDto>> GetSecretaryDashboardAsync(CancellationToken cancellationToken = default);
}