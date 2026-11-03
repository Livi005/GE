using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/explorer")]
[Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Secretary},{Roles.YearHead}")]
public class ExplorerController : ControllerBase
{
    private readonly IExplorerService _service;
    public ExplorerController(IExplorerService service) => _service = service;

    [HttpGet("tree")]
    public async Task<IActionResult> GetTree(CancellationToken ct)
        => this.ToActionResult(await _service.GetTreeAsync(ct));
}