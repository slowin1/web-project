using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.Auth;

public interface IRegisterFlow
{
    Task<UserResponseDto> RegisterAsync(UserRegisterDto dto);
    Task<UserResponseDto?> LoginAsync(UserLoginDto dto);
}
