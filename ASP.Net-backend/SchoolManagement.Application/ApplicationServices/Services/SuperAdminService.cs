using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Institution;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.SuperAdmin;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class SuperAdminService : ISuperAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;
    private readonly IUserRegistrationService _userRegistration;

    public SuperAdminService(
        IUnitOfWork unitOfWork,
        IIdentityManager identityManager,
        IUserRegistrationService userRegistration)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
        _userRegistration = userRegistration;
    }

    public async Task<Result<SuperAdminDashboardDto>> GetDashboardAsync(
        CancellationToken cancellationToken = default)
    {
        var institutions = await _unitOfWork.Repository<Institution>().Query()
            .OrderBy(i => i.Name)
            .ToListAsync(cancellationToken);

        var totalUsers = _identityManager.ListUsers().Count;

        var institutionDtos = new List<InstitutionDto>();
        foreach (var inst in institutions)
        {
            var usersCount = await CountUsersInInstitutionAsync(inst.IdInstitution, cancellationToken);
            institutionDtos.Add(new InstitutionDto
            {
                IdInstitution = inst.IdInstitution,
                Name = inst.Name,
                Domain = inst.Domain,
                Email = inst.Email,
                Phone = inst.Phone,
                Plan = (int)inst.Plan,
                Status = (int)inst.Status,
                CreatedAt = inst.CreatedAt,
                UsersCount = usersCount
            });
        }

        return Result.Success(new SuperAdminDashboardDto
        {
            TotalInstitutions = institutions.Count,
            TotalUsers = totalUsers,
            Uptime = "99.9%",
            Institutions = institutionDtos
        });
    }

    // ---------- Usuarios globales ----------

    public async Task<Result<IReadOnlyList<UserGlobalDto>>> ListUsersAsync(
        CancellationToken cancellationToken = default)
    {
        var users = _identityManager.ListUsers();
        var result = new List<UserGlobalDto>();

        var institutions = await _unitOfWork.Repository<Institution>().Query()
            .ToListAsync(cancellationToken);
        var instById = institutions.ToDictionary(i => i.IdInstitution, i => i.Name);

        foreach (var user in users)
        {
            var roles = await _identityManager.GetRolesAsync(user.Id);
            var role = roles.FirstOrDefault() ?? "";

            int? institutionId = await ResolveInstitutionIdAsync(user.Id, role, cancellationToken);

            result.Add(new UserGlobalDto
            {
                Id = user.Id,
                UserName = user.UserName ?? "",
                Email = user.Email ?? "",
                Role = role,
                InstitutionId = institutionId,
                InstitutionName = institutionId.HasValue && instById.ContainsKey(institutionId.Value)
                    ? instById[institutionId.Value]
                    : "",
                IsActive = true
            });
        }

        return Result.Success<IReadOnlyList<UserGlobalDto>>(result);
    }

    public async Task<Result<UserGlobalDto>> CreateUserAsync(
        CreateUserGlobalDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Password))
            return Result.Failure<UserGlobalDto>(Error.Validation("UserName y Password son requeridos."));

        var (user, _) = await _userRegistration.RegisterUserAsync(
            dto.Role, dto.UserName, "global", dto.InstitutionId, cancellationToken);

        // Asignar perfil según rol
        await AssignProfileAsync(user, dto.Role, dto.InstitutionId, cancellationToken);

        return await GetUserByIdAsync(user.Id, cancellationToken);
    }

    public async Task<Result<UserGlobalDto>> UpdateUserAsync(
        string userId, UpdateUserGlobalDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userId);
        if (user is null)
        {
            // buscar por id
            var all = _identityManager.ListUsers();
            user = all.FirstOrDefault(u => u.Id == userId);
        }
        if (user is null) return Result.NotFound<UserGlobalDto>("User", userId);

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            user.Email = dto.Email;
            await _identityManager.UpdateUserAsync(user);
        }

        return await GetUserByIdAsync(user.Id, cancellationToken);
    }

    public async Task<Result> DeleteUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var (succeeded, errors) = await _identityManager.DeleteUserAsync(userId);
        if (!succeeded)
            return Result.Failure(Error.Validation(string.Join(", ", errors)));

        return Result.Success();
    }

    // ---------- Helpers ----------

    private async Task<Result<UserGlobalDto>> GetUserByIdAsync(
        string userId, CancellationToken cancellationToken)
    {
        var user = _identityManager.ListUsers().FirstOrDefault(u => u.Id == userId);
        if (user is null) return Result.NotFound<UserGlobalDto>("User", userId);

        var roles = await _identityManager.GetRolesAsync(user.Id);
        var role = roles.FirstOrDefault() ?? "";
        var institutionId = await ResolveInstitutionIdAsync(user.Id, role, cancellationToken);

        var instName = "";
        if (institutionId.HasValue)
        {
            var inst = await _unitOfWork.Repository<Institution>()
                .GetByIdAsync(institutionId.Value, cancellationToken);
            instName = inst?.Name ?? "";
        }

        return Result.Success(new UserGlobalDto
        {
            Id = user.Id,
            UserName = user.UserName ?? "",
            Email = user.Email ?? "",
            Role = role,
            InstitutionId = institutionId,
            InstitutionName = instName,
            IsActive = true
        });
    }

    private async Task<int?> ResolveInstitutionIdAsync(
        string userId, string role, CancellationToken cancellationToken)
    {
        switch (role)
        {
            case "Director":
                var admin = await _unitOfWork.Repository<Administrator>().Query()
                    .FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);
                return admin?.IdInstitution;
            case "Secretary":
                var sec = await _unitOfWork.Repository<Secretary>().Query()
                    .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
                return sec?.IdInstitution;
            case "Professor":
                var prof = await _unitOfWork.Repository<Professor>().Query()
                    .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
                return prof?.IdInstitution;
            case "Student":
                var stud = await _unitOfWork.Repository<Student>().Query()
                    .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
                return stud?.IdInstitution;
            case "Maintenance":
                var maint = await _unitOfWork.Repository<MaintenanceWorker>().Query()
                    .FirstOrDefaultAsync(m => m.UserId == userId, cancellationToken);
                return maint?.IdInstitution;
            case "YearHead":
                var yh = await _unitOfWork.Repository<YearHead>().Query()
                    .FirstOrDefaultAsync(y => y.UserId == userId, cancellationToken);
                return yh?.IdInstitution;
            default:
                return null; // SuperAdmin
        }
    }

    private async Task AssignProfileAsync(
        User user, string role, int? institutionId, CancellationToken cancellationToken)
    {
        var instId = institutionId ?? 1;

        switch (role)
        {
            case "Director":
                await _unitOfWork.Repository<Administrator>().AddAsync(new Administrator
                {
                    UserId = user.Id,
                    AdminName = user.UserName ?? "Director",
                    AdminSalary = 0,
                    IdInstitution = instId
                }, cancellationToken);
                break;
            case "Secretary":
                await _unitOfWork.Repository<Secretary>().AddAsync(new Secretary
                {
                    UserId = user.Id,
                    NameS = user.UserName ?? "Secretary",
                    SalaryS = 0,
                    IdInstitution = instId
                }, cancellationToken);
                break;
            case "Maintenance":
                await _unitOfWork.Repository<MaintenanceWorker>().AddAsync(new MaintenanceWorker
                {
                    UserId = user.Id,
                    NameMaint = user.UserName ?? "Maintenance",
                    SalaryMaint = 0,
                    IdInstitution = instId
                }, cancellationToken);
                break;
            case "YearHead":
                await _unitOfWork.Repository<YearHead>().AddAsync(new YearHead
                {
                    UserId = user.Id,
                    NameYearHead = user.UserName ?? "YearHead",
                    IdInstitution = instId
                }, cancellationToken);
                break;
            // Professor y Student se crean por sus propios endpoints
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<int> CountUsersInInstitutionAsync(
        int institutionId, CancellationToken cancellationToken)
    {
        var admins = await _unitOfWork.Repository<Administrator>().Query()
            .CountAsync(a => a.IdInstitution == institutionId, cancellationToken);
        var secs = await _unitOfWork.Repository<Secretary>().Query()
            .CountAsync(s => s.IdInstitution == institutionId, cancellationToken);
        var profs = await _unitOfWork.Repository<Professor>().Query()
            .CountAsync(p => p.IdInstitution == institutionId, cancellationToken);
        var studs = await _unitOfWork.Repository<Student>().Query()
            .CountAsync(s => s.IdInstitution == institutionId, cancellationToken);
        var maints = await _unitOfWork.Repository<MaintenanceWorker>().Query()
            .CountAsync(m => m.IdInstitution == institutionId, cancellationToken);
        var yhs = await _unitOfWork.Repository<YearHead>().Query()
            .CountAsync(y => y.IdInstitution == institutionId, cancellationToken);

        return admins + secs + profs + studs + maints + yhs;
    }
}