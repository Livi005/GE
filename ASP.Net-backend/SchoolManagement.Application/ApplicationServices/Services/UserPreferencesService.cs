using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Preferences;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class UserPreferencesService : IUserPreferencesService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;

    public UserPreferencesService(IUnitOfWork unitOfWork, IIdentityManager identityManager)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
    }

    public async Task<Result<UserPreferencesDto>> GetAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null) return Result.NotFound<UserPreferencesDto>("User", userName);

        var prefs = await _unitOfWork.Repository<UserPreferences>().Query()
            .FirstOrDefaultAsync(p => p.UserId == user.Id, cancellationToken);

        return Result.Success(new UserPreferencesDto
        {
            Theme = prefs?.Theme ?? "light",
            EmailNotifications = prefs?.EmailNotifications ?? true,
            MaintenanceAlerts = prefs?.MaintenanceAlerts ?? true
        });
    }

    public async Task<Result<UserPreferencesDto>> UpdateAsync(
        string userName, UserPreferencesDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null) return Result.NotFound<UserPreferencesDto>("User", userName);

        var prefs = await _unitOfWork.Repository<UserPreferences>().Query()
            .FirstOrDefaultAsync(p => p.UserId == user.Id, cancellationToken);

        if (prefs is null)
        {
            prefs = new UserPreferences
            {
                UserId = user.Id,
                Theme = dto.Theme,
                EmailNotifications = dto.EmailNotifications,
                MaintenanceAlerts = dto.MaintenanceAlerts
            };
            await _unitOfWork.Repository<UserPreferences>().AddAsync(prefs, cancellationToken);
        }
        else
        {
            prefs.Theme = dto.Theme;
            prefs.EmailNotifications = dto.EmailNotifications;
            prefs.MaintenanceAlerts = dto.MaintenanceAlerts;
            _unitOfWork.Repository<UserPreferences>().Update(prefs);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(new UserPreferencesDto
        {
            Theme = prefs.Theme,
            EmailNotifications = prefs.EmailNotifications,
            MaintenanceAlerts = prefs.MaintenanceAlerts
        });
    }
}