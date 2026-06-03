using Microsoft.AspNetCore.Mvc;
using eUseControl.BussinessLogic.Functions.Users;
using eUseControl.Domain.DTOs;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserFlow _userFlow;

    public UsersController(IUserFlow userFlow)
    {
        _userFlow = userFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userFlow.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userFlow.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userFlow.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userFlow.UpdateAsync(id, dto);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateUserRoleDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var user = await _userFlow.UpdateRoleAsync(id, dto);
            return user is null ? NotFound() : Ok(user);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _userFlow.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
