using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Reservation;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class ReservationService : IReservationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;

    public ReservationService(IUnitOfWork unitOfWork, IIdentityManager identityManager)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
    }

    public async Task<Result<IReadOnlyList<ReservationDto>>> GetMineAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null) return Result.NotFound<IReadOnlyList<ReservationDto>>("User", userName);

        var professor = await _unitOfWork.Repository<Professor>().Query()
            .FirstOrDefaultAsync(p => p.UserId == user.Id, cancellationToken);
        if (professor is null) return Result.NotFound<IReadOnlyList<ReservationDto>>("Professor", userName);

        var items = await _unitOfWork.Repository<Reservation>().Query()
            .Include(r => r.Professor)
            .Include(r => r.ClassRoom)
            .Include(r => r.Subject)
            .Where(r => r.IdProf == professor.IdProf)
            .OrderByDescending(r => r.Date)
            .ToListAsync(cancellationToken);

        var dtos = items.Select(r => new ReservationDto
        {
            IdReservation = r.IdReservation,
            IdProf = r.IdProf,
            IdClassR = r.IdClassR,
            IdSub = r.IdSub,
            Date = r.Date,
            StartTime = r.StartTime,
            EndTime = r.EndTime,
            ProfessorName = r.Professor?.NameProf ?? string.Empty,
            ClassRoomLocation = r.ClassRoom?.Location ?? string.Empty,
            SubjectName = r.Subject?.NameSub ?? string.Empty
        }).ToList();

        return Result.Success<IReadOnlyList<ReservationDto>>(dtos);
    }

    public async Task<Result> CancelAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id, cancellationToken);
        if (entity is null) return Result.Failure(Error.NotFound("Reservation", id));

        _unitOfWork.Repository<Reservation>().Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}