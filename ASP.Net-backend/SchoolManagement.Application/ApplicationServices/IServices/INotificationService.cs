using SchoolManagement.Application.ApplicationServices.Maps_Dto.Notification;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface INotificationService
{
    Task<Result<NotificationResponse>> GetNotificationsAsync(
        string userId, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<NotificationDto>>> GetUserNotificationsAsync(
        string userName, CancellationToken cancellationToken = default);

    Task<Result<int>> CreateNotificationAsync(
        CreateNotificationDto dto, CancellationToken cancellationToken = default);

    Task<Result> MarkAllAsReadAsync(
        string userName, CancellationToken cancellationToken = default);

    Task<Result> MarkOneAsReadAsync(
        int notificationId, CancellationToken cancellationToken = default);
}