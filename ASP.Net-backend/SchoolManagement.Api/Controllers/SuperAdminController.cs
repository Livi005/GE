using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/superadmin")]
[Authorize(Roles = Roles.SuperAdmin)]
public class SuperAdminController : ControllerBase
{
    private readonly ISuperAdminService _service;
    public SuperAdminController(ISuperAdminService service) => _service = service;

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(CancellationToken ct)
        => this.ToActionResult(await _service.GetDashboardAsync(ct));
}