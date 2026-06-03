using eUseControl.BussinessLogic.Functions.ServiceBookings;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceBookingsController : ControllerBase
{
    private readonly IServiceBookingFlow _serviceBookingFlow;

    public ServiceBookingsController(IServiceBookingFlow serviceBookingFlow)
    {
        _serviceBookingFlow = serviceBookingFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _serviceBookingFlow.GetAllAsync());

    [HttpGet("completed")]
    public async Task<IActionResult> GetCompleted() => Ok(await _serviceBookingFlow.GetCompletedAsync());

    [HttpGet("specialist/{specialistId}")]
    public async Task<IActionResult> GetBySpecialist(string specialistId) =>
        Ok(await _serviceBookingFlow.GetBySpecialistAsync(specialistId));

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(string userId) =>
        Ok(await _serviceBookingFlow.GetByUserAsync(userId));

    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots([FromQuery] string serviceId, [FromQuery] DateTime date)
    {
        if (string.IsNullOrWhiteSpace(serviceId))
        {
            return BadRequest(new { message = "Не указана услуга." });
        }

        return Ok(await _serviceBookingFlow.GetAvailableSlotsAsync(serviceId, date));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var booking = await _serviceBookingFlow.GetByIdAsync(id);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceBookingDto dto)
    {
        try
        {
            return Ok(await _serviceBookingFlow.CreateAsync(dto));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateServiceBookingDto dto)
    {
        try
        {
            var booking = await _serviceBookingFlow.UpdateAsync(id, dto);
            return booking is null ? NotFound() : Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateServiceBookingStatusDto dto)
    {
        var booking = await _serviceBookingFlow.UpdateStatusAsync(id, dto);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> PutStatus(string id, [FromBody] UpdateServiceBookingStatusDto dto)
    {
        var booking = await _serviceBookingFlow.UpdateStatusAsync(id, dto);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(string id)
    {
        var completed = await _serviceBookingFlow.CompleteAsync(id);
        return completed is null ? NotFound() : Ok(completed);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _serviceBookingFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
