using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Identity;
using SchoolManagement.Application.Authentication;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class IdentityService : IIdentityService
{
    private readonly IIdentityManager _identityManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<IdentityService> _logger;

    public IdentityService(
        IIdentityManager identityManager,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<IdentityService> logger)
    {
        _identityManager = identityManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<(string Token, string UserId)> CreateUserAsync(
        RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var user = _mapper.Map<User>(dto);
        var role = string.IsNullOrWhiteSpace(dto.Role) ? Roles.Student : dto.Role;

        var (succeeded, created, errors) = await _identityManager.CreateUserAsync(user, dto.Password ?? string.Empty);
        if (!succeeded || created is null)
            throw new InvalidOperationException($"No se pudo crear el usuario: {string.Join(", ", errors)}");

        var (roleOk, roleErrors) = await _identityManager.AddRoleAsync(created.Id, role);
        if (!roleOk)
            throw new InvalidOperationException($"No se pudo asignar el rol: {string.Join(", ", roleErrors)}");

        var token = _jwtTokenGenerator.GenerateToken(created, role);
        return (token, created.Id);
    }

    public async Task<(bool Success, string Token, string Role, string UserName, bool IsDean, int? InstitutionId, string Theme)>
        CheckCredentialsAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Password))
            return (false, string.Empty, string.Empty, string.Empty, false, null, "light");

        var valid = await _identityManager.CheckCredentialsAsync(dto.UserName, dto.Password);
        if (!valid) return (false, string.Empty, string.Empty, string.Empty, false, null, "light");

        var user = await _identityManager.FindByUserNameAsync(dto.UserName);
        if (user is null) return (false, string.Empty, string.Empty, string.Empty, false, null, "light");

        // Tema guardado
        var prefs = await _unitOfWork.Repository<UserPreferences>().Query()
            .FirstOrDefaultAsync(p => p.UserId == user.Id, cancellationToken);
        var theme = prefs?.Theme ?? "light";

        foreach (var role in Roles.All)
        {
            if (!await _identityManager.IsInRoleAsync(user.Id, role)) continue;

            var isDean = false;
            int? institutionId = null;

            if (role == Roles.Professor)
            {
                var professor = await _unitOfWork.Repository<Professor>().Query()
                    .FirstOrDefaultAsync(p => p.UserId == user.Id, cancellationToken);
                if (professor is not null)
                {
                    isDean = professor.IsDean;
                    institutionId = professor.IdInstitution;
                }
            }
            else if (role == Roles.Student)
            {
                var student = await _unitOfWork.Repository<Student>().Query()
                    .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);
                if (student is not null) institutionId = student.IdInstitution;
            }
            else if (role == Roles.Director)
            {
                var admin = await _unitOfWork.Repository<Administrator>().Query()
                    .FirstOrDefaultAsync(a => a.UserId == user.Id, cancellationToken);
                if (admin is not null) institutionId = admin.IdInstitution;
            }
            else if (role == Roles.Secretary)
            {
                var sec = await _unitOfWork.Repository<Secretary>().Query()
                    .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);
                if (sec is not null) institutionId = sec.IdInstitution;
            }
            else if (role == Roles.Maintenance)
            {
                var maint = await _unitOfWork.Repository<MaintenanceWorker>().Query()
                    .FirstOrDefaultAsync(m => m.UserId == user.Id, cancellationToken);
                if (maint is not null) institutionId = maint.IdInstitution;
            }
            else if (role == Roles.YearHead)
            {
                var yh = await _unitOfWork.Repository<YearHead>().Query()
                    .FirstOrDefaultAsync(y => y.UserId == user.Id, cancellationToken);
                if (yh is not null) institutionId = yh.IdInstitution;
            }

            var token = _jwtTokenGenerator.GenerateToken(user, role, isDean, institutionId);
            return (true, token, role, user.UserName ?? string.Empty, isDean, institutionId, theme);
        }

        _logger.LogWarning("Usuario {UserName} sin rol asignado", dto.UserName);
        return (false, string.Empty, string.Empty, string.Empty, false, null, "light");
    }

    public Task<IReadOnlyList<User>> ListUsersAsync(CancellationToken cancellationToken = default)
        => Task.FromResult(_identityManager.ListUsers());

    public async Task<Result> ChangePasswordAsync(string userName, ChangePasswordDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.Failure(Error.NotFound("User", userName));

        var (succeeded, errors) = await _identityManager.ChangePasswordAsync(user.Id, dto.CurrentPassword, dto.NewPassword);

        if (!succeeded)
            return Result.Failure(Error.Validation(string.Join(", ", errors)));

        return Result.Success();
    }
        public async Task<Result> DeleteUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var (succeeded, errors) = await _identityManager.DeleteUserAsync(userId);
        if (!succeeded)
            return Result.Failure(Error.Validation(string.Join(", ", errors)));

        return Result.Success();
    }

        public async Task<Result> DeleteMyAccountAsync(string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.Failure(Error.NotFound("User", userName));

        var (succeeded, errors) = await _identityManager.DeleteUserAsync(user.Id);
        if (!succeeded)
            return Result.Failure(Error.Validation(string.Join(", ", errors)));

        return Result.Success();
    }
}