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

        return Result.Success<IReadOnlyList<InstitutionDto>>(items.Select(MapToDto).ToList());
    }

    public async Task<Result<InstitutionDto>> GetByIdAsync(
        int id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Institution>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.NotFound<InstitutionDto>("Institution", id);
        return Result.Success(MapToDto(entity));
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
        return Result.Success(MapToDto(entity));
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
        return Result.Success(MapToDto(entity));
    }

    public async Task<Result> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Institution>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.Failure(Error.NotFound("Institution", id));

        _unitOfWork.Repository<Institution>().Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    private static InstitutionDto MapToDto(Institution i) => new()
    {
        IdInstitution = i.IdInstitution,
        Name = i.Name,
        Domain = i.Domain,
        Email = i.Email,
        Phone = i.Phone,
        Plan = (int)i.Plan,
        Status = (int)i.Status,
        UsersCount = 0,   // se puede calcular con un join si se necesita
        CreatedAt = i.CreatedAt,
        LastActive = null
    };
}