using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.Users;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.Users;

public interface IUserFlow
{
    Task<IEnumerable<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto?> GetByIdAsync(string id);
    Task<UserResponseDto> CreateAsync(CreateUserDto dto);
    Task<UserResponseDto?> UpdateAsync(string id, UpdateUserDto dto);
    Task<UserResponseDto?> UpdateRoleAsync(string id, UpdateUserRoleDto dto);
    Task<bool> DeleteAsync(string id);
}

public class UserFlow : UserActions, IUserFlow
{
    public UserFlow(UserContext context)
        : base(context)
    {
    }
}
