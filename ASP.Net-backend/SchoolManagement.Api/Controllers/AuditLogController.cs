using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/superadmin/audit-logs")]
[Authorize(Roles = Roles.SuperAdmin)]
public class AuditLogController : ControllerBase
{
    private readonly IAuditLogService _service;
    public AuditLogController(IAuditLogService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? type = null,
        CancellationToken ct = default)
        => this.ToActionResult(await _service.ListAsync(page, pageSize, search, type, ct));
}