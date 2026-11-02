using SchoolManagement.Application.ApplicationServices.Maps_Dto.Schedule;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IScheduleService
{
    Task<Result<IReadOnlyList<ScheduleDto>>> GetByStudentAsync(
        string userName, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<ScheduleDto>>> GetByProfessorAsync(
        string userName, CancellationToken cancellationToken = default);

    Task<Result<ScheduleDto>> CreateAsync(
        ScheduleDto dto, CancellationToken cancellationToken = default);

    Task<Result> DeleteAsync(
        int id, CancellationToken cancellationToken = default);
}