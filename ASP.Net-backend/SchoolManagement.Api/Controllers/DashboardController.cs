using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("student/{userName}")]
    [Authorize(Roles = $"{Roles.Student},{Roles.SuperAdmin}")]
    public async Task<IActionResult> GetStudentDashboard(string userName, CancellationToken ct)
        => this.ToActionResult(await _dashboardService.GetStudentDashboardAsync(userName));

    [HttpGet("professor/{userName}")]
    [Authorize(Roles = $"{Roles.Professor},{Roles.SuperAdmin}")]
    public async Task<IActionResult> GetProfessorDashboard(string userName, CancellationToken ct)
        => this.ToActionResult(await _dashboardService.GetProfessorDashboardAsync(userName));

    [HttpGet("classrooms/available")]
    [Authorize(Roles = $"{Roles.Professor},{Roles.SuperAdmin}")]
    public async Task<IActionResult> GetAvailableClassRooms(CancellationToken ct)
        => this.ToActionResult(await _dashboardService.GetAvailableClassRoomsAsync());

        [HttpGet("admin")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director}")]
    public async Task<IActionResult> GetAdminDashboard(CancellationToken ct)
        => this.ToActionResult(await _dashboardService.GetAdminDashboardAsync(ct));

    [HttpGet("secretary")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary}")]
    public async Task<IActionResult> GetSecretaryDashboard(CancellationToken ct)
        => this.ToActionResult(await _dashboardService.GetSecretaryDashboardAsync(ct));
}