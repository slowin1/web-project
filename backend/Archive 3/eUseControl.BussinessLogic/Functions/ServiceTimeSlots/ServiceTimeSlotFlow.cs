using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.ServiceTimeSlots;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.ServiceTimeSlots;

public interface IServiceTimeSlotFlow
{
    Task<IEnumerable<ServiceTimeSlotResponseDto>> GetAllAsync();
    Task<ServiceTimeSlotResponseDto?> GetByIdAsync(string id);
    Task<ServiceTimeSlotResponseDto> CreateAsync(CreateServiceTimeSlotDto dto);
    Task<ServiceTimeSlotResponseDto?> UpdateAsync(string id, UpdateServiceTimeSlotDto dto);
    Task<bool> DeleteAsync(string id);
}

public class ServiceTimeSlotFlow : ServiceTimeSlotActions, IServiceTimeSlotFlow
{
    public ServiceTimeSlotFlow(UserContext context)
        : base(context)
    {
    }
}
