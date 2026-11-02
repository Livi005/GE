using SchoolManagement.Application.ApplicationServices.Maps_Dto.Preferences;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IUserPreferencesService
{
    Task<Result<UserPreferencesDto>> GetAsync(string userName, CancellationToken cancellationToken = default);
    Task<Result<UserPreferencesDto>> UpdateAsync(string userName, UserPreferencesDto dto, CancellationToken cancellationToken = default);
}