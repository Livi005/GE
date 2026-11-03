using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.SuperAdmin;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/superadmin")]
[Authorize(Roles = Roles.SuperAdmin)]
public class SuperAdminController : ControllerBase
{
    private readonly ISuperAdminService _service;
    public SuperAdminController(ISuperAdminService service) => _service = service;

    // Dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken ct)
        => this.ToActionResult(await _service.GetDashboardAsync(ct));

    // Usuarios globales
    [HttpGet("users")]
    public async Task<IActionResult> ListUsers(CancellationToken ct)
        => this.ToActionResult(await _service.ListUsersAsync(ct));

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserGlobalDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.CreateUserAsync(dto, ct), created: true);

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserGlobalDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.UpdateUserAsync(id, dto, ct));

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id, CancellationToken ct)
        => this.ToActionResult(await _service.DeleteUserAsync(id, ct));
}