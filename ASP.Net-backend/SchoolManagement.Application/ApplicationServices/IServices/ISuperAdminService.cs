using SchoolManagement.Application.ApplicationServices.Maps_Dto.SuperAdmin;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface ISuperAdminService
{
    Task<Result<SuperAdminDashboardDto>> GetDashboardAsync(CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<UserGlobalDto>>> ListUsersAsync(CancellationToken cancellationToken = default);
    Task<Result<UserGlobalDto>> CreateUserAsync(CreateUserGlobalDto dto, CancellationToken cancellationToken = default);
    Task<Result<UserGlobalDto>> UpdateUserAsync(string userId, UpdateUserGlobalDto dto, CancellationToken cancellationToken = default);
    Task<Result> DeleteUserAsync(string userId, CancellationToken cancellationToken = default);
}