using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core.ContentItems;
using eUseControl.Domain.DTOs;

namespace eUseControl.BussinessLogic.Functions.ContentItems;

public interface IContentItemFlow
{
    Task<IEnumerable<ContentItemResponseDto>> GetAllAsync(string? type);
    Task<ContentItemResponseDto?> GetByIdAsync(string id);
    Task<ContentItemResponseDto> CreateAsync(CreateContentItemDto dto);
    Task<ContentItemResponseDto?> UpdateAsync(string id, UpdateContentItemDto dto);
    Task<bool> DeleteAsync(string id);
}

public class ContentItemFlow : ContentItemActions, IContentItemFlow
{
    public ContentItemFlow(UserContext context)
        : base(context)
    {
    }
}
