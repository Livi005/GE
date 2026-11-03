using SchoolManagement.Application.ApplicationServices.Maps_Dto.Reservation;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IReservationService
{
    Task<Result<IReadOnlyList<ReservationDto>>> GetMineAsync(
        string userName, CancellationToken cancellationToken = default);

    Task<Result> CancelAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<AvailableReservationDto>> GetAvailableResourcesAsync(
        CancellationToken cancellationToken = default);
} 