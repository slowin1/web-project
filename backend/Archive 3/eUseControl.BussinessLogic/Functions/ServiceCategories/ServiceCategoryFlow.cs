using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.ServiceCategories;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.ServiceCategories;

public interface IServiceCategoryFlow
{
    Task<IEnumerable<ServiceCategoryResponseDto>> GetAllAsync();
    Task<ServiceCategoryResponseDto?> GetByIdAsync(string id);
    Task<ServiceCategoryResponseDto> CreateAsync(CreateServiceCategoryDto dto);
    Task<ServiceCategoryResponseDto?> UpdateAsync(string id, UpdateServiceCategoryDto dto);
    Task<bool> DeleteAsync(string id);
}

public class ServiceCategoryFlow : ServiceCategoryActions, IServiceCategoryFlow
{
    public ServiceCategoryFlow(UserContext context)
        : base(context)
    {
    }
}
