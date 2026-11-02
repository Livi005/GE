using SchoolManagement.Application.ApplicationServices.Maps_Dto.ProfessorEvaluation;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IProfessorEvaluationService
{
    Task<Result<ProfessorEvaluationResponseDto>> CreateAsync(
        ProfessorEvaluationDto dto, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<ProfessorEvaluationResponseDto>>> GetByProfessorAsync(
        int professorId, CancellationToken cancellationToken = default);
}