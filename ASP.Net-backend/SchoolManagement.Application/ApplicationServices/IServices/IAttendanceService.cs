using SchoolManagement.Application.ApplicationServices.Maps_Dto.Attendance;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IAttendanceService
{
    Task<Result> SaveAsync(AttendanceSaveDto dto, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<AttendanceDto>>> GetAsync(
        int idSub, DateTime  date, CancellationToken cancellationToken = default);
}