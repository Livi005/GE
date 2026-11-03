using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Student;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("student")]
[Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary},{Roles.Professor},{Roles.YearHead}")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _service;
    public StudentController(IStudentService service) => _service = service;

    [HttpPost("create")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary}")]
    public async Task<IActionResult> Create([FromBody] StudentDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.CreateWithUserAsync(dto, ct), created: true);

    [HttpGet("list")]
    public async Task<IActionResult> List(CancellationToken ct)
        => this.ToActionResult(await _service.ListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => this.ToActionResult(await _service.GetByIdAsync(id, ct));

    [HttpPut("update/{id:int}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary}")]
    public async Task<IActionResult> Update(int id, [FromBody] StudentDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.UpdateAsync(id, dto, ct));

    [HttpDelete("delete/{id:int}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => this.ToActionResult(await _service.DeleteAsync(id, ct));

    [HttpGet("getBadStudents")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary},{Roles.Professor}")]
    public async Task<IActionResult> GetBadStudents(CancellationToken ct)
        => this.ToActionResult(await _service.GetBadStudentsAsync(ct));

    [HttpGet("my-grades")]
    [Authorize(Roles = $"{Roles.Student},{Roles.SuperAdmin}")]
    public async Task<IActionResult> GetMyGrades([FromQuery] string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetMyGradesAsync(userName, ct));

    [HttpGet("my-professors")]
    [Authorize(Roles = $"{Roles.Student},{Roles.SuperAdmin}")]
    public async Task<IActionResult> GetMyProfessors([FromQuery] string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetMyProfessorsAsync(userName, ct));
}