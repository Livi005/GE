using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.ProfessorEvaluation;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class ProfessorEvaluationService : IProfessorEvaluationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;

    public ProfessorEvaluationService(IUnitOfWork unitOfWork, IIdentityManager identityManager)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
    }

    public async Task<Result<ProfessorEvaluationResponseDto>> CreateAsync(
        ProfessorEvaluationDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return Result.Failure<ProfessorEvaluationResponseDto>(
                Error.Validation("El rating debe estar entre 1 y 5."));

        var user = await _identityManager.FindByUserNameAsync(dto.StudentUserName);
        if (user is null)
            return Result.NotFound<ProfessorEvaluationResponseDto>("User", dto.StudentUserName);

        var student = await _unitOfWork.Repository<Student>().Query()
            .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);
        if (student is null)
            return Result.NotFound<ProfessorEvaluationResponseDto>("Student", dto.StudentUserName);

        var professor = await _unitOfWork.Repository<Professor>()
            .GetByIdAsync(dto.ProfessorId, cancellationToken);
        if (professor is null)
            return Result.NotFound<ProfessorEvaluationResponseDto>("Professor", dto.ProfessorId);

        // Verificar que no haya evaluado antes a ese profesor
        var already = await _unitOfWork.Repository<ProfessorEvaluation>().Query()
            .AnyAsync(e => e.IdProf == dto.ProfessorId && e.IdStud == student.IdStud, cancellationToken);
        if (already)
            return Result.Failure<ProfessorEvaluationResponseDto>(
                Error.Conflict("Ya evaluaste a este profesor."));

        var entity = new ProfessorEvaluation
        {
            IdProf = dto.ProfessorId,
            IdStud = student.IdStud,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<ProfessorEvaluation>().AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(new ProfessorEvaluationResponseDto
        {
            IdEval = entity.IdEval,
            ProfessorName = professor.NameProf,
            Rating = entity.Rating,
            Comment = entity.Comment,
            CreatedAt = entity.CreatedAt
        });
    }

    public async Task<Result<IReadOnlyList<ProfessorEvaluationResponseDto>>> GetByProfessorAsync(
        int professorId, CancellationToken cancellationToken = default)
    {
        var items = await _unitOfWork.Repository<ProfessorEvaluation>().Query()
            .Include(e => e.Professor)
            .Where(e => e.IdProf == professorId)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new ProfessorEvaluationResponseDto
            {
                IdEval = e.IdEval,
                ProfessorName = e.Professor.NameProf,
                Rating = e.Rating,
                Comment = e.Comment,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<ProfessorEvaluationResponseDto>>(items);
    }
}