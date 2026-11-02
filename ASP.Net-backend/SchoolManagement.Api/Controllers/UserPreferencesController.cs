using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Preferences;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/user/preferences")]
[Authorize]
public class UserPreferencesController : ControllerBase
{
    private readonly IUserPreferencesService _service;
    public UserPreferencesController(IUserPreferencesService service) => _service = service;

    [HttpGet("{userName}")]
    public async Task<IActionResult> Get(string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetAsync(userName, ct));

    [HttpPut("{userName}")]
    public async Task<IActionResult> Update(
        string userName, [FromBody] UserPreferencesDto dto, CancellationToken ct)
        => this.ToActionResult(await _service.UpdateAsync(userName, dto, ct));
}