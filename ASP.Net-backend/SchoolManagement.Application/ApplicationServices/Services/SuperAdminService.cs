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

    public SuperAdminService(IUnitOfWork unitOfWork, IIdentityManager identityManager)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
    }

    public async Task<Result<SuperAdminDashboardDto>> GetDashboardAsync(
        CancellationToken cancellationToken = default)
    {
        var institutions = await _unitOfWork.Repository<Institution>().Query()
            .OrderBy(i => i.Name)
            .ToListAsync(cancellationToken);

        var totalUsers = _identityManager.ListUsers().Count;

        return Result.Success(new SuperAdminDashboardDto
        {
            TotalInstitutions = institutions.Count,
            TotalUsers = totalUsers,
            Uptime = "99.9%",
            Institutions = institutions.Select(i => new InstitutionDto
            {
                IdInstitution = i.IdInstitution,
                Name = i.Name,
                Domain = i.Domain,
                Email = i.Email,
                Phone = i.Phone,
                Plan = (int)i.Plan,
                Status = (int)i.Status,
                CreatedAt = i.CreatedAt
            }).ToList()
        });
    }
}