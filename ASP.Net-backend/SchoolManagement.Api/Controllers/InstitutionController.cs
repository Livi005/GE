using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Institution;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/institutions")]
[Authorize(Roles = Roles.SuperAdmin)]
public class InstitutionController : ControllerBase
{
    private readonly IInstitutionService _service;
    public InstitutionController(IInstitutionService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => this.ToActionResult(await _service.ListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => this.ToActionResult(await _service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInstitutionDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.CreateAsync(dto, ct), created: true);

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateInstitutionDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.UpdateAsync(id, dto, ct));

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => this.ToActionResult(await _service.DeleteAsync(id, ct));
}