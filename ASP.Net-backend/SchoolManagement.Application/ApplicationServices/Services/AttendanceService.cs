using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Attendance;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IUnitOfWork _unitOfWork;

    public AttendanceService(IUnitOfWork unitOfWork)
        => _unitOfWork = unitOfWork;

    public async Task<Result> SaveAsync(
        AttendanceSaveDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.Records.Count == 0)
            return Result.Failure(Error.Validation("Records no puede estar vacío."));

        var subject = await _unitOfWork.Repository<Subject>().GetByIdAsync(dto.IdSub, cancellationToken);
        if (subject is null)
            return Result.Failure(Error.NotFound("Subject", dto.IdSub));

        foreach (var record in dto.Records)
        {
            var existing = await _unitOfWork.Repository<Attendance>().Query()
                .FirstOrDefaultAsync(a =>
                    a.IdSub == dto.IdSub && a.IdStud == record.IdStud && a.Date == dto.Date,
                    cancellationToken);

            if (existing is null)
            {
                await _unitOfWork.Repository<Attendance>().AddAsync(new Attendance
                {
                    IdSub = dto.IdSub,
                    IdStud = record.IdStud,
                    Date = dto.Date,
                    Status = (AttendanceStatus)record.Status
                }, cancellationToken);
            }
            else
            {
                existing.Status = (AttendanceStatus)record.Status;
                _unitOfWork.Repository<Attendance>().Update(existing);
            }
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    public async Task<Result<IReadOnlyList<AttendanceDto>>> GetAsync(
        int idSub, DateTime date, CancellationToken cancellationToken = default)
    {
        var items = await _unitOfWork.Repository<Attendance>().Query()
            .Include(a => a.Student)
            .Where(a => a.IdSub == idSub && a.Date == date)
            .ToListAsync(cancellationToken);

        var dtos = items.Select(a => new AttendanceDto
        {
            IdAttendance = a.IdAttendance,
            IdSub = a.IdSub,
            IdStud = a.IdStud,
            Date = a.Date,
            Status = (int)a.Status,
            StudentName = a.Student is { } s ? $"{s.Name1} {s.LastName1}".Trim() : string.Empty
        }).ToList();

        return Result.Success<IReadOnlyList<AttendanceDto>>(dtos);
    }
}