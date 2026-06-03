using eUseControl.BussinessLogic.Functions.SpecialistWorkSchedules;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpecialistWorkSchedulesController : ControllerBase
{
    private readonly ISpecialistWorkScheduleFlow _specialistWorkScheduleFlow;

    public SpecialistWorkSchedulesController(ISpecialistWorkScheduleFlow specialistWorkScheduleFlow)
    {
        _specialistWorkScheduleFlow = specialistWorkScheduleFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _specialistWorkScheduleFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var schedule = await _specialistWorkScheduleFlow.GetByIdAsync(id);
        return schedule is null ? NotFound() : Ok(schedule);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSpecialistWorkScheduleDto dto) => Ok(await _specialistWorkScheduleFlow.CreateAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSpecialistWorkScheduleDto dto)
    {
        var schedule = await _specialistWorkScheduleFlow.UpdateAsync(id, dto);
        return schedule is null ? NotFound() : Ok(schedule);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _specialistWorkScheduleFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
