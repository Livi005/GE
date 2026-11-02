using SchoolManagement.Application.ApplicationServices.Maps_Dto.AuditLog;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IAuditLogService
{
    Task<Result<IReadOnlyList<AuditLogDto>>> ListAsync(
        int page, int pageSize, string? search, string? type,
        CancellationToken cancellationToken = default);

    Task<Result> LogAsync(
        string userId, string userName, string action, string module,
        string? details, string? ip, string type,
        CancellationToken cancellationToken = default);
}