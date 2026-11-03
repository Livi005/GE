using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Institution;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class InstitutionService : IInstitutionService
{
    private readonly IUnitOfWork _unitOfWork;

    public InstitutionService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<IReadOnlyList<InstitutionDto>>> ListAsync(
        CancellationToken cancellationToken = default)
    {
        var items = await _unitOfWork.Repository<Institution>().Query()
            .OrderBy(i => i.Name)
            .ToListAsync(cancellationToken);

        var dtos = new List<InstitutionDto>();
        foreach (var i in items)
            dtos.Add(await MapToDtoWithCountAsync(i, cancellationToken));

        return Result.Success<IReadOnlyList<InstitutionDto>>(dtos);
    }

    public async Task<Result<InstitutionDto>> GetByIdAsync(
        int id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Institution>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.NotFound<InstitutionDto>("Institution", id);

        var dto = await MapToDtoWithCountAsync(entity, cancellationToken);
        return Result.Success(dto);
    }

    public async Task<Result<InstitutionDto>> CreateAsync(
        CreateInstitutionDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Domain))
            return Result.Failure<InstitutionDto>(Error.Validation("Name y Domain son requeridos."));

        var exists = await _unitOfWork.Repository<Institution>().Query()
            .AnyAsync(i => i.Domain == dto.Domain, cancellationToken);
        if (exists)
            return Result.Failure<InstitutionDto>(Error.Conflict("Ya existe una institución con ese dominio."));

        var entity = new Institution
        {
            Name = dto.Name,
            Domain = dto.Domain,
            Email = dto.Email,
            Phone = dto.Phone,
            Plan = (InstitutionPlan)dto.Plan,
            Status = InstitutionStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Institution>().AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var response = await MapToDtoWithCountAsync(entity, cancellationToken);
        return Result.Success(response);
    }

    public async Task<Result<InstitutionDto>> UpdateAsync(
        int id, CreateInstitutionDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Institution>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.NotFound<InstitutionDto>("Institution", id);

        entity.Name = dto.Name;
        entity.Domain = dto.Domain;
        entity.Email = dto.Email;
        entity.Phone = dto.Phone;
        entity.Plan = (InstitutionPlan)dto.Plan;

        _unitOfWork.Repository<Institution>().Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var response = await MapToDtoWithCountAsync(entity, cancellationToken);
        return Result.Success(response);
    }

    public async Task<Result> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Institution>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.Failure(Error.NotFound("Institution", id));

        _unitOfWork.Repository<Institution>().Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    private async Task<InstitutionDto> MapToDtoWithCountAsync(
        Institution i, CancellationToken cancellationToken)
    {
        var usersCount = 0;
        usersCount += await _unitOfWork.Repository<Administrator>().Query()
            .CountAsync(a => a.IdInstitution == i.IdInstitution, cancellationToken);
        usersCount += await _unitOfWork.Repository<Secretary>().Query()
            .CountAsync(s => s.IdInstitution == i.IdInstitution, cancellationToken);
        usersCount += await _unitOfWork.Repository<Professor>().Query()
            .CountAsync(p => p.IdInstitution == i.IdInstitution, cancellationToken);
        usersCount += await _unitOfWork.Repository<Student>().Query()
            .CountAsync(s => s.IdInstitution == i.IdInstitution, cancellationToken);
        usersCount += await _unitOfWork.Repository<MaintenanceWorker>().Query()
            .CountAsync(m => m.IdInstitution == i.IdInstitution, cancellationToken);
        usersCount += await _unitOfWork.Repository<YearHead>().Query()
            .CountAsync(y => y.IdInstitution == i.IdInstitution, cancellationToken);

        return new InstitutionDto
        {
            IdInstitution = i.IdInstitution,
            Name = i.Name,
            Domain = i.Domain,
            Email = i.Email,
            Phone = i.Phone,
            Plan = (int)i.Plan,
            Status = (int)i.Status,
            CreatedAt = i.CreatedAt,
            UsersCount = usersCount
        };
    }
}