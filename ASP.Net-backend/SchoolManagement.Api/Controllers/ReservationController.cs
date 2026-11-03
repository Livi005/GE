using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Api.Extensions;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Api.Controllers;

[ApiController]
[Route("api/reservation")]
[Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Professor}")]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _service;
    public ReservationController(IReservationService service) => _service = service;

    [HttpGet("my-reservations")]
    public async Task<IActionResult> GetMine([FromQuery] string userName, CancellationToken ct)
        => this.ToActionResult(await _service.GetMineAsync(userName, ct));

    [HttpDelete("cancel/{id:int}")]
    public async Task<IActionResult> Cancel(int id, CancellationToken ct)
        => this.ToActionResult(await _service.CancelAsync(id, ct));

    [HttpGet("available")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Director},{Roles.Professor}")]
    public async Task<IActionResult> GetAvailable(CancellationToken ct)
        => this.ToActionResult(await _service.GetAvailableResourcesAsync(ct));
}