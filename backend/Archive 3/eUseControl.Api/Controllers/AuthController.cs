using eUseControl.BussinessLogic.Functions.Auth;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IRegisterFlow _registerFlow;

    public AuthController(IRegisterFlow registerFlow)
    {
        _registerFlow = registerFlow;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _registerFlow.RegisterAsync(dto);
            return Ok(user);
        }
        catch (InvalidOperationException exception)
        {
            return new JsonResult(new { message = exception.Message }) { StatusCode = 400 };
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var user = await _registerFlow.LoginAsync(dto);
        return user is null ? new JsonResult(new { message = "Неверный логин или пароль" }) { StatusCode = 401 } : Ok(user);
    }
}
