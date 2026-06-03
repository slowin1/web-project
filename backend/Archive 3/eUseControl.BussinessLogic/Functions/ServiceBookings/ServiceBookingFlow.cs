using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.ServiceBookings;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.ServiceBookings;

public interface IServiceBookingFlow
{
    Task<IEnumerable<ServiceBookingResponseDto>> GetAllAsync();
    Task<IEnumerable<ServiceBookingResponseDto>> GetBySpecialistAsync(string specialistId);
    Task<IEnumerable<ServiceBookingResponseDto>> GetByUserAsync(string userId);
    Task<ServiceBookingResponseDto?> GetByIdAsync(string id);
    Task<IEnumerable<string>> GetAvailableSlotsAsync(string serviceId, DateTime date);
    Task<ServiceBookingResponseDto> CreateAsync(CreateServiceBookingDto dto);
    Task<ServiceBookingResponseDto?> UpdateAsync(string id, UpdateServiceBookingDto dto);
    Task<ServiceBookingResponseDto?> UpdateStatusAsync(string id, UpdateServiceBookingStatusDto dto);
    Task<CompletedSpecialistServiceResponseDto?> CompleteAsync(string id);
    Task<IEnumerable<CompletedSpecialistServiceResponseDto>> GetCompletedAsync();
    Task<bool> DeleteAsync(string id);
}

public class ServiceBookingFlow : ServiceBookingActions, IServiceBookingFlow
{
    public ServiceBookingFlow(UserContext context)
        : base(context)
    {
    }
}
