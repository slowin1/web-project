using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.SpecialistWorkSchedules;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.SpecialistWorkSchedules;

public interface ISpecialistWorkScheduleFlow
{
    Task<IEnumerable<SpecialistWorkScheduleResponseDto>> GetAllAsync();
    Task<SpecialistWorkScheduleResponseDto?> GetByIdAsync(string id);
    Task<SpecialistWorkScheduleResponseDto> CreateAsync(CreateSpecialistWorkScheduleDto dto);
    Task<SpecialistWorkScheduleResponseDto?> UpdateAsync(string id, UpdateSpecialistWorkScheduleDto dto);
    Task<bool> DeleteAsync(string id);
}

public class SpecialistWorkScheduleFlow : SpecialistWorkScheduleActions, ISpecialistWorkScheduleFlow
{
    public SpecialistWorkScheduleFlow(UserContext context)
        : base(context)
    {
    }
}
