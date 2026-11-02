using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Attendance;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;
    public AttendanceController(IAttendanceService service) => _service = service;

    [HttpPost("save")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Professor}")]
    public async Task<IActionResult> Save([FromBody] AttendanceSaveDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.SaveAsync(dto, ct));

    [HttpGet("get")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary},{Roles.Professor}")]
    public async Task<IActionResult> Get(
        [FromQuery] int idSub, [FromQuery] DateTime  date, CancellationToken ct)
        => this.ToActionResult(await _service.GetAsync(idSub, date, ct));
}