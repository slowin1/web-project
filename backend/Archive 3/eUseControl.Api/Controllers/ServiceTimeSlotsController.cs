using eUseControl.BussinessLogic.Functions.ServiceTimeSlots;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceTimeSlotsController : ControllerBase
{
    private readonly IServiceTimeSlotFlow _serviceTimeSlotFlow;

    public ServiceTimeSlotsController(IServiceTimeSlotFlow serviceTimeSlotFlow)
    {
        _serviceTimeSlotFlow = serviceTimeSlotFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _serviceTimeSlotFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var slot = await _serviceTimeSlotFlow.GetByIdAsync(id);
        return slot is null ? NotFound() : Ok(slot);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceTimeSlotDto dto) => Ok(await _serviceTimeSlotFlow.CreateAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateServiceTimeSlotDto dto)
    {
        var slot = await _serviceTimeSlotFlow.UpdateAsync(id, dto);
        return slot is null ? NotFound() : Ok(slot);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _serviceTimeSlotFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
