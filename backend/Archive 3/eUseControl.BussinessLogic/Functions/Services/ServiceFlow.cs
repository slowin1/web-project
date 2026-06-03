using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.Services;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.Services;

public interface IServiceFlow
{
    Task<IEnumerable<ServiceResponseDto>> GetAllAsync();
    Task<ServiceResponseDto?> GetByIdAsync(string id);
    Task<ServiceResponseDto> CreateAsync(CreateServiceDto dto);
    Task<ServiceResponseDto?> UpdateAsync(string id, UpdateServiceDto dto);
    Task<bool> DeleteAsync(string id);
}

public class ServiceFlow : ServiceActions, IServiceFlow
{
    public ServiceFlow(UserContext context)
        : base(context)
    {
    }
}
