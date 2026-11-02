using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Schedule;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/schedule")]
[Authorize]
public class ScheduleController : ControllerBase
{
    private readonly IScheduleService _service;
    public ScheduleController(IScheduleService service) => _service = service;

    [HttpGet("student/{userName}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary},{Roles.Professor},{Roles.Student}")]
    public async Task<IActionResult> GetByStudent(string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetByStudentAsync(userName, ct));

    [HttpGet("professor/{userName}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Professor}")]
    public async Task<IActionResult> GetByProfessor(string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetByProfessorAsync(userName, ct));

    [HttpPost("create")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary}")]
    public async Task<IActionResult> Create([FromBody] ScheduleDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.CreateAsync(dto, ct), created: true);

    [HttpDelete("delete/{id:int}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => this.ToActionResult(await _service.DeleteAsync(id, ct));
}