using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.AuditLog;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IUnitOfWork _unitOfWork;

    public AuditLogService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<IReadOnlyList<AuditLogDto>>> ListAsync(
        int page, int pageSize, string? search, string? type,
        CancellationToken cancellationToken = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;

        IQueryable<AuditLog> query = _unitOfWork.Repository<AuditLog>().Query();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(l =>
                l.UserName.Contains(search) ||
                l.Action.Contains(search) ||
                l.Module.Contains(search));

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(l => l.Type.ToString() == type);

        var items = await query
            .OrderByDescending(l => l.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new AuditLogDto
            {
                Id = l.IdLog,
                UserId = l.UserId,
                UserName = l.UserName,
                Action = l.Action,
                Module = l.Module,
                Details = l.Details,
                Ip = l.Ip,
                Date = l.Date,
                Type = l.Type.ToString()
            })
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<AuditLogDto>>(items);
    }

    public async Task<Result> LogAsync(
        string userId, string userName, string action, string module,
        string? details, string? ip, string type,
        CancellationToken cancellationToken = default)
    {
        var logType = Enum.TryParse<AuditLogType>(type, ignoreCase: true, out var parsed)
            ? parsed
            : AuditLogType.Info;

        await _unitOfWork.Repository<AuditLog>().AddAsync(new AuditLog
        {
            UserId = userId,
            UserName = userName,
            Action = action,
            Module = module,
            Details = details,
            Ip = ip,
            Date = DateTime.UtcNow,
            Type = logType
        }, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}