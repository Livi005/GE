using SchoolManagement.Application.ApplicationServices.Maps_Dto.SuperAdmin;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface ISuperAdminService
{
    Task<Result<SuperAdminDashboardDto>> GetDashboardAsync(
        CancellationToken cancellationToken = default);
}