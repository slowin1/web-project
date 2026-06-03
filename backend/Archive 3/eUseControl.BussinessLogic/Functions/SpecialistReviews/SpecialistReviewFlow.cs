using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.SpecialistReviews;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.SpecialistReviews;

public interface ISpecialistReviewFlow
{
    Task<IEnumerable<SpecialistReviewResponseDto>> GetAllAsync();
    Task<SpecialistReviewResponseDto?> GetByIdAsync(string id);
    Task<SpecialistReviewResponseDto> CreateAsync(CreateSpecialistReviewDto dto);
    Task<SpecialistReviewResponseDto?> UpdateAsync(string id, UpdateSpecialistReviewDto dto);
    Task<bool> DeleteAsync(string id);
}

public class SpecialistReviewFlow : SpecialistReviewActions, ISpecialistReviewFlow
{
    public SpecialistReviewFlow(UserContext context)
        : base(context)
    {
    }
}
