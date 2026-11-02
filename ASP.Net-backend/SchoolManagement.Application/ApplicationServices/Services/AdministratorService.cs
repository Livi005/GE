using AutoMapper;
using Microsoft.Extensions.Logging;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Administrator;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class AdministratorService
    : BaseService<Administrator, AdministratorDto, AdministratorResponseDto>, IAdministratorService
{
    private readonly IUserRegistrationService _userRegistration;
    private readonly IValidationService _validation;

    public AdministratorService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<AdministratorService> logger,
        IUserRegistrationService userRegistration,
        IValidationService validation)
        : base(unitOfWork, mapper, logger)
    {
        _userRegistration = userRegistration;
        _validation = validation;
    }

    public override Task<Result<AdministratorResponseDto>> CreateAsync(
        AdministratorDto dto,
        CancellationToken cancellationToken = default)
        => throw new NotSupportedException("Usa CreateWithUserAsync para crear un administrador.");

        public Task<Result<AdministratorCreateResponseDto>> CreateWithUserAsync(
        AdministratorDto dto,
        CancellationToken cancellationToken = default)
        => throw new NotSupportedException(
            "Los directores se crean desde el módulo SuperAdmin (por institución).");
}