using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Notification;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("notification")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _service;
    public NotificationController(INotificationService service) => _service = service;

    [HttpGet("get")]
    public async Task<IActionResult> Get([FromQuery] string userId, CancellationToken ct)
        => this.ToActionResult(await _service.GetNotificationsAsync(userId, ct));
    
    [HttpGet("user/{userName}")]
    public async Task<IActionResult> GetUserNotifications(string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetUserNotificationsAsync(userName, ct));

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateNotificationDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.CreateNotificationAsync(dto, ct), created: true);

    [HttpPut("mark-read/{userName}")]
    public async Task<IActionResult> MarkAllAsRead(string userName, CancellationToken ct)
        => this.ToActionResult(await _service.MarkAllAsReadAsync(userName, ct));

    [HttpPut("mark-one-read/{id:int}")]
    public async Task<IActionResult> MarkOneAsRead(int id, CancellationToken ct)
        => this.ToActionResult(await _service.MarkOneAsReadAsync(id, ct));
}