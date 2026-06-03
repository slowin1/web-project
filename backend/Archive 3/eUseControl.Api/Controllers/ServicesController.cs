using eUseControl.BussinessLogic.Functions.Services;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly IServiceFlow _serviceFlow;

    public ServicesController(IServiceFlow serviceFlow)
    {
        _serviceFlow = serviceFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _serviceFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var service = await _serviceFlow.GetByIdAsync(id);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceDto dto) => Ok(await _serviceFlow.CreateAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateServiceDto dto)
    {
        var service = await _serviceFlow.UpdateAsync(id, dto);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _serviceFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
