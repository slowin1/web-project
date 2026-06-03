using eUseControl.BussinessLogic.Functions.LoginLogs;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginLogsController : ControllerBase
{
    private readonly ILoginLogFlow _loginLogFlow;

    public LoginLogsController(ILoginLogFlow loginLogFlow)
    {
        _loginLogFlow = loginLogFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _loginLogFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var log = await _loginLogFlow.GetByIdAsync(id);
        return log is null ? NotFound() : Ok(log);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLoginLogDto dto) => Ok(await _loginLogFlow.CreateAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateLoginLogDto dto)
    {
        var log = await _loginLogFlow.UpdateAsync(id, dto);
        return log is null ? NotFound() : Ok(log);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _loginLogFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
