using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Notification;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Notifications;
using SchoolManagement.Domain.Relations;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IUnitOfWork unitOfWork,
        IIdentityManager identityManager,
        ILogger<NotificationService> logger)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
        _logger = logger;
    }

    public async Task<Result<NotificationResponse>> GetNotificationsAsync(
        string userId, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userId);
        if (user is null)
            return Result.NotFound<NotificationResponse>("User", userId);

        var response = new NotificationResponse();

        if (await _identityManager.IsInRoleAsync(user.Id, Roles.Director))
        {
            await RefreshMeanNotificationsAsync(cancellationToken);
            await AppendPendingMeanNotificationsAsync(response, cancellationToken);
        }
        else if (await _identityManager.IsInRoleAsync(user.Id, Roles.SuperAdmin))
        {
            await RefreshProfessorNotificationsAsync(cancellationToken);
            await AppendPendingProfessorNotificationsAsync(response, cancellationToken);
        }

        return Result.Success(response);
    }

    // ---------- Medios ----------

    private async Task RefreshMeanNotificationsAsync(CancellationToken cancellationToken)
    {
        var oneYearAgo = DateTime.UtcNow.AddYears(-1);

        var problematicMeans = await _unitOfWork.Repository<Maintenance>().Query()
            .Where(m => m.MaintenanceDate >= oneYearAgo)
            .GroupBy(m => m.TypeOfMean == MeanType.Technological ? m.IdTechMean : m.IdAuxMean)
            .Select(g => new { MeanId = g.Key, Count = g.Count() })
            .Where(x => x.MeanId.HasValue && x.Count >= 3)
            .ToListAsync(cancellationToken);

        var existing = await _unitOfWork.Repository<MeanNotification>().Query()
            .Select(n => n.IdMean)
            .ToListAsync(cancellationToken);
        var existingSet = existing.ToHashSet();

        foreach (var item in problematicMeans)
        {
            if (item.MeanId is null || existingSet.Contains(item.MeanId.Value)) continue;

            var meanName = await GetMeanNameAsync(item.MeanId.Value, cancellationToken);
            var meanType = await GetMeanTypeAsync(item.MeanId.Value, cancellationToken);

            await _unitOfWork.Repository<MeanNotification>().AddAsync(new MeanNotification
            {
                IdMean = item.MeanId.Value,
                MeanName = meanName,
                MeanType = meanType.ToString(),
                BeenSended = false
            }, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task AppendPendingMeanNotificationsAsync(
        NotificationResponse response, CancellationToken cancellationToken)
    {
        var pending = await _unitOfWork.Repository<MeanNotification>().Query()
            .Where(n => !n.BeenSended)
            .ToListAsync(cancellationToken);

        foreach (var n in pending)
        {
            response.Messages.Add(
                $"El medio {n.MeanName} ha tenido más de 3 mantenimientos en el último año. Su id es {n.IdMean}.");
            n.BeenSended = true;
            _unitOfWork.Repository<MeanNotification>().Update(n);
        }

        if (pending.Count > 0) await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<string> GetMeanNameAsync(int meanId, CancellationToken cancellationToken)
    {
        var tech = await _unitOfWork.Repository<TechnologicalMeans>().GetByIdAsync(meanId, cancellationToken);
        if (tech is not null) return tech.NameMean;

        var aux = await _unitOfWork.Repository<AuxiliaryMeans>().GetByIdAsync(meanId, cancellationToken);
        return aux?.NameMean ?? string.Empty;
    }

    private async Task<MeanType> GetMeanTypeAsync(int meanId, CancellationToken cancellationToken)
    {
        var tech = await _unitOfWork.Repository<TechnologicalMeans>().GetByIdAsync(meanId, cancellationToken);
        return tech is not null ? MeanType.Technological : MeanType.Auxiliary;
    }

    // ---------- Profesores ----------

    private async Task RefreshProfessorNotificationsAsync(CancellationToken cancellationToken)
    {
        var allEvaluations = await _unitOfWork.Repository<ProfStudSubCourse>().Query()
            .Select(e => new { e.IdProf, e.Evaluation })
            .ToListAsync(cancellationToken);

        var problematic = allEvaluations
            .GroupBy(e => e.IdProf)
            .Where(g => g.Count() >= 5 && g.All(x => x.Evaluation < 3))
            .Select(g => g.Key)
            .ToList();

        var existing = await _unitOfWork.Repository<ProfessorNotification>().Query()
            .Select(n => n.IdProf)
            .ToListAsync(cancellationToken);
        var existingSet = existing.ToHashSet();

        foreach (var professorId in problematic)
        {
            if (existingSet.Contains(professorId)) continue;

            var professor = await _unitOfWork.Repository<Professor>()
                .GetByIdAsync(professorId, cancellationToken);
            if (professor is null) continue;

            await _unitOfWork.Repository<ProfessorNotification>().AddAsync(new ProfessorNotification
            {
                IdProf = professorId,
                ProfName = professor.NameProf,
                Professor = professor,
                BeenSended = false
            }, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task AppendPendingProfessorNotificationsAsync(
        NotificationResponse response, CancellationToken cancellationToken)
    {
        var pending = await _unitOfWork.Repository<ProfessorNotification>().Query()
            .Where(n => !n.BeenSended)
            .ToListAsync(cancellationToken);

        foreach (var n in pending)
        {
            response.Messages.Add(
                $"El profesor {n.ProfName} tiene 5 o más evaluaciones todas por debajo de 3. Su Id={n.IdProf}.");
            n.BeenSended = true;
            _unitOfWork.Repository<ProfessorNotification>().Update(n);
        }

        if (pending.Count > 0) await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

        // ---------- Notificaciones genéricas ----------

    public async Task<Result<IReadOnlyList<NotificationDto>>> GetUserNotificationsAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.NotFound<IReadOnlyList<NotificationDto>>("User", userName);

        var items = await _unitOfWork.Repository<Notification>().Query()
            .Where(n => n.UserId == user.Id)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                Id = n.IdNotification,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToString(),
                Module = n.Module,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<NotificationDto>>(items);
    }

    public async Task<Result<int>> CreateNotificationAsync(
        CreateNotificationDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
            return Result.Failure<int>(Error.Validation("Title y Message son requeridos."));

        if (dto.TargetRoles.Count == 0)
            return Result.Failure<int>(Error.Validation("Debes indicar al menos un TargetRole."));

        var type = Enum.TryParse<NotificationType>(dto.Type, ignoreCase: true, out var parsedType)
            ? parsedType
            : NotificationType.Info;

        // Resolver todos los usuarios de los roles destino
        var allUsers = _identityManager.ListUsers();
        var targetUserIds = new List<string>();

        foreach (var user in allUsers)
        {
            var roles = await _identityManager.GetRolesAsync(user.Id);
            if (roles.Any(r => dto.TargetRoles.Contains(r)))
                targetUserIds.Add(user.Id);
        }

        if (targetUserIds.Count == 0)
            return Result.Failure<int>(Error.Validation("No hay usuarios en los roles indicados."));

        var notifications = targetUserIds.Select(userId => new Notification
        {
            UserId = userId,
            SenderUserId = null,
            Title = dto.Title,
            Message = dto.Message,
            Type = type,
            Module = dto.Module,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        await _unitOfWork.Repository<Notification>().AddRangeAsync(notifications, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(notifications.Count);
    }

    public async Task<Result> MarkAllAsReadAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.Failure(Error.NotFound("User", userName));

        var pending = await _unitOfWork.Repository<Notification>().Query()
            .Where(n => n.UserId == user.Id && !n.IsRead)
            .ToListAsync(cancellationToken);

        foreach (var n in pending)
        {
            n.IsRead = true;
            _unitOfWork.Repository<Notification>().Update(n);
        }

        if (pending.Count > 0)
            await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> MarkOneAsReadAsync(
        int notificationId, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Repository<Notification>()
            .GetByIdAsync(notificationId, cancellationToken);

        if (entity is null)
            return Result.Failure(Error.NotFound("Notification", notificationId));

        entity.IsRead = true;
        _unitOfWork.Repository<Notification>().Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}