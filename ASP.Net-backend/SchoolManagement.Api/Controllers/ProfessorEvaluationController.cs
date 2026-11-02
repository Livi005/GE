using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.ProfessorEvaluation;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/student")]
[Authorize]
public class ProfessorEvaluationController : ControllerBase
{
    private readonly IProfessorEvaluationService _service;
    public ProfessorEvaluationController(IProfessorEvaluationService service) => _service = service;

    [HttpPost("evaluate-professor")]
    [Authorize(Roles = $"{Roles.Student},{Roles.SuperAdmin}")]
    public async Task<IActionResult> Evaluate([FromBody] ProfessorEvaluationDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.CreateAsync(dto, ct), created: true);

    [HttpGet("evaluations/{professorId:int}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Professor}")]
    public async Task<IActionResult> GetByProfessor(int professorId, CancellationToken ct)
        => this.ToActionResult(await _service.GetByProfessorAsync(professorId, ct));
}