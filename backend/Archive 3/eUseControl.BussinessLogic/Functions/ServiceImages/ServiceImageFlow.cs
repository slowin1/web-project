using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.ServiceImages;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.ServiceImages;

public interface IServiceImageFlow
{
    Task<IEnumerable<ServiceImageResponseDto>> GetAllAsync();
    Task<ServiceImageResponseDto?> GetByIdAsync(string id);
    Task<ServiceImageResponseDto> CreateAsync(CreateServiceImageDto dto);
    Task<ServiceImageResponseDto?> UpdateAsync(string id, UpdateServiceImageDto dto);
    Task<bool> DeleteAsync(string id);
}

public class ServiceImageFlow : ServiceImageActions, IServiceImageFlow
{
    public ServiceImageFlow(UserContext context)
        : base(context)
    {
    }
}
