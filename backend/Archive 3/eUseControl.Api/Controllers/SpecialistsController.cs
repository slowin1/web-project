using eUseControl.BussinessLogic.Functions.Specialists;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpecialistsController : ControllerBase
{
    private readonly ISpecialistFlow _specialistFlow;

    public SpecialistsController(ISpecialistFlow specialistFlow)
    {
        _specialistFlow = specialistFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _specialistFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var specialist = await _specialistFlow.GetByIdAsync(id);
        return specialist is null ? NotFound() : Ok(specialist);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSpecialistDto dto)
    {
        try
        {
            return Ok(await _specialistFlow.CreateAsync(dto));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSpecialistDto dto)
    {
        try
        {
            var specialist = await _specialistFlow.UpdateAsync(id, dto);
            return specialist is null ? NotFound() : Ok(specialist);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _specialistFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
