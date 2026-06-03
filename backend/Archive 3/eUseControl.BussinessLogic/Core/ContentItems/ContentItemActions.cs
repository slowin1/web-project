using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.content;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.ContentItems;

public class ContentItemActions
{
    private readonly UserContext _context;

    protected ContentItemActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ContentItemResponseDto>> GetAllAsync(string? type)
    {
        var query = _context.ContentItems.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(type))
        {
            var normalizedType = Normalize(type);
            query = query.Where(item => item.ContentType == normalizedType);
        }

        var items = await query
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Title)
            .ToListAsync();

        return items.Select(MapItem);
    }

    public async Task<ContentItemResponseDto?> GetByIdAsync(string id)
    {
        var item = await _context.ContentItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return item is null ? null : MapItem(item);
    }

    public async Task<ContentItemResponseDto> CreateAsync(CreateContentItemDto dto)
    {
        var now = DateTime.UtcNow;
        var item = new ContentItemData
        {
            Id = Guid.NewGuid().ToString(),
            ContentType = Normalize(dto.ContentType),
            Title = dto.Title.Trim(),
            Slug = NormalizeSlug(dto.Slug),
            Subtitle = dto.Subtitle.Trim(),
            Body = dto.Body.Trim(),
            ImageUrl = dto.ImageUrl.Trim(),
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.ContentItems.Add(item);
        await _context.SaveChangesAsync();

        return MapItem(item);
    }

    public async Task<ContentItemResponseDto?> UpdateAsync(string id, UpdateContentItemDto dto)
    {
        var item = await _context.ContentItems.FindAsync(id);
        if (item is null)
        {
            return null;
        }

        item.ContentType = Normalize(dto.ContentType);
        item.Title = dto.Title.Trim();
        item.Slug = NormalizeSlug(dto.Slug);
        item.Subtitle = dto.Subtitle.Trim();
        item.Body = dto.Body.Trim();
        item.ImageUrl = dto.ImageUrl.Trim();
        item.SortOrder = dto.SortOrder;
        item.IsActive = dto.IsActive;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapItem(item);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var item = await _context.ContentItems.FindAsync(id);
        if (item is null)
        {
            return false;
        }

        _context.ContentItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ContentItemResponseDto MapItem(ContentItemData item)
    {
        return new ContentItemResponseDto
        {
            Id = item.Id,
            ContentType = item.ContentType,
            Title = item.Title,
            Slug = item.Slug,
            Subtitle = item.Subtitle,
            Body = item.Body,
            ImageUrl = item.ImageUrl,
            SortOrder = item.SortOrder,
            IsActive = item.IsActive,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }

    private static string Normalize(string value)
    {
        return value.Trim().ToLowerInvariant();
    }

    private static string NormalizeSlug(string value)
    {
        return value.Trim().ToLowerInvariant().Replace(" ", "-");
    }
}
