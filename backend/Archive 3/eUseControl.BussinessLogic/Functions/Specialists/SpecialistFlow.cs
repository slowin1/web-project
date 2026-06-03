using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.Specialists;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.Specialists;

public interface ISpecialistFlow
{
    Task<IEnumerable<SpecialistResponseDto>> GetAllAsync();
    Task<SpecialistResponseDto?> GetByIdAsync(string id);
    Task<SpecialistResponseDto> CreateAsync(CreateSpecialistDto dto);
    Task<SpecialistResponseDto?> UpdateAsync(string id, UpdateSpecialistDto dto);
    Task<bool> DeleteAsync(string id);
}

public class SpecialistFlow : SpecialistActions, ISpecialistFlow
{
    public SpecialistFlow(UserContext context)
        : base(context)
    {
    }
}
