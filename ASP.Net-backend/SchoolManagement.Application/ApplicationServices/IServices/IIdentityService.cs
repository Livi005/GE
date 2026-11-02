using SchoolManagement.Application.ApplicationServices.Maps_Dto;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Identity;
using SchoolManagement.Application.Common;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IIdentityService
{
    Task<(string Token, string UserId)> CreateUserAsync(RegisterDto dto, CancellationToken cancellationToken = default);

    Task<(bool Success, string Token, string Role, string UserName, bool IsDean, int? InstitutionId)>
        CheckCredentialsAsync(LoginDto dto, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<User>> ListUsersAsync(CancellationToken cancellationToken = default);

    Task<Result> ChangePasswordAsync(string userName, ChangePasswordDto dto, CancellationToken cancellationToken = default);
}