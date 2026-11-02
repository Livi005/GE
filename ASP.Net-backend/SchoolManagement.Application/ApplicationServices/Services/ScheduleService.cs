using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Schedule;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Relations;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class ScheduleService : IScheduleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;
    private readonly ILogger<ScheduleService> _logger;

    public ScheduleService(
        IUnitOfWork unitOfWork,
        IIdentityManager identityManager,
        ILogger<ScheduleService> logger)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<ScheduleDto>>> GetByStudentAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.NotFound<IReadOnlyList<ScheduleDto>>("User", userName);

        var student = await _unitOfWork.Repository<Student>().Query()
            .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);
        if (student is null)
            return Result.NotFound<IReadOnlyList<ScheduleDto>>("Student", userName);

        var subjectIds = await _unitOfWork.Repository<StudentSubject>().Query()
            .Where(ss => ss.IdStud == student.IdStud)
            .Select(ss => ss.IdSub)
            .ToListAsync(cancellationToken);

        var items = await _unitOfWork.Repository<Schedule>().Query()
            .Include(s => s.Subject)
            .Include(s => s.Professor)
            .Include(s => s.ClassRoom)
            .Where(s => subjectIds.Contains(s.IdSub))
            .OrderBy(s => s.Day).ThenBy(s => s.StartTime)
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<ScheduleDto>>(items.Select(MapToDto).ToList());
    }

    public async Task<Result<IReadOnlyList<ScheduleDto>>> GetByProfessorAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.NotFound<IReadOnlyList<ScheduleDto>>("User", userName);

        var professor = await _unitOfWork.Repository<Professor>().Query()
            .FirstOrDefaultAsync(p => p.UserId == user.Id, cancellationToken);
        if (professor is null)
            return Result.NotFound<IReadOnlyList<ScheduleDto>>("Professor", userName);

        var items = await _unitOfWork.Repository<Schedule>().Query()
            .Include(s => s.Subject)
            .Include(s => s.Professor)
            .Include(s => s.ClassRoom)
            .Where(s => s.IdProf == professor.IdProf)
            .OrderBy(s => s.Day).ThenBy(s => s.StartTime)
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<ScheduleDto>>(items.Select(MapToDto).ToList());
    }

    public async Task<Result<ScheduleDto>> CreateAsync(
        ScheduleDto dto, CancellationToken cancellationToken = default)
    {
        var subject = await _unitOfWork.Repository<Subject>().GetByIdAsync(dto.IdSub, cancellationToken);
        if (subject is null) return Result.NotFound<ScheduleDto>("Subject", dto.IdSub);

        var professor = await _unitOfWork.Repository<Professor>().GetByIdAsync(dto.IdProf, cancellationToken);
        if (professor is null) return Result.NotFound<ScheduleDto>("Professor", dto.IdProf);

        var classRoom = await _unitOfWork.Repository<ClassRoom>().GetByIdAsync(dto.IdClassR, cancellationToken);
        if (classRoom is null) return Result.NotFound<ScheduleDto>("ClassRoom", dto.IdClassR);

        var entity = new Schedule
        {
            IdSub = dto.IdSub,
            IdProf = dto.IdProf,
            IdClassR = dto.IdClassR,
            Day = (DayOfWeek)dto.Day,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime
        };

        await _unitOfWork.Repository<Schedule>().AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        entity.Subject = subject;
        entity.Professor = professor;
        entity.ClassRoom = classRoom;

        return Result.Success(MapToDto(entity));
    }

    public async Task<Result> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Schedule>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.Failure(Error.NotFound("Schedule", id));

        _unitOfWork.Repository<Schedule>().Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    private static ScheduleDto MapToDto(Schedule s) => new()
    {
        IdSchedule = s.IdSchedule,
        IdSub = s.IdSub,
        IdProf = s.IdProf,
        IdClassR = s.IdClassR,
        Day = (int)s.Day,
        StartTime = s.StartTime,
        EndTime = s.EndTime,
        SubjectName = s.Subject?.NameSub ?? string.Empty,
        ProfessorName = s.Professor?.NameProf ?? string.Empty,
        ClassRoomLocation = s.ClassRoom?.Location ?? string.Empty
    };
}