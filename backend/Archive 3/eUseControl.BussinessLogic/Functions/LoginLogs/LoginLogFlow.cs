using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.LoginLogs;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.LoginLogs;

public interface ILoginLogFlow
{
    Task<IEnumerable<LoginLogResponseDto>> GetAllAsync();
    Task<LoginLogResponseDto?> GetByIdAsync(string id);
    Task<LoginLogResponseDto> CreateAsync(CreateLoginLogDto dto);
    Task<LoginLogResponseDto?> UpdateAsync(string id, UpdateLoginLogDto dto);
    Task<bool> DeleteAsync(string id);
}

public class LoginLogFlow : LoginLogActions, ILoginLogFlow
{
    public LoginLogFlow(UserContext context)
        : base(context)
    {
    }
}
