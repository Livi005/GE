using SchoolManagement.Application.ApplicationServices.Maps_Dto.Institution;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IInstitutionService
{
    Task<Result<IReadOnlyList<InstitutionDto>>> ListAsync(CancellationToken cancellationToken = default);
    Task<Result<InstitutionDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<InstitutionDto>> CreateAsync(CreateInstitutionDto dto, CancellationToken cancellationToken = default);
    Task<Result<InstitutionDto>> UpdateAsync(int id, CreateInstitutionDto dto, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(int id, CancellationToken cancellationToken = default);
}