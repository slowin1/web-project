using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.services;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.ServiceCategories;

public class ServiceCategoryActions
{
    private readonly UserContext _context;

    protected ServiceCategoryActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServiceCategoryResponseDto>> GetAllAsync()
    {
        var categories = await _context.ServiceCategories.AsNoTracking().ToListAsync();
        return categories.Select(MapCategory);
    }

    public async Task<ServiceCategoryResponseDto?> GetByIdAsync(string id)
    {
        var category = await _context.ServiceCategories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return category is null ? null : MapCategory(category);
    }

    public async Task<ServiceCategoryResponseDto> CreateAsync(CreateServiceCategoryDto dto)
    {
        var category = new ServiceCategoryData
        {
            Id = Guid.NewGuid().ToString(),
            NameOfCategory = dto.NameOfCategory.Trim(),
            IsActive = dto.IsActive
        };

        _context.ServiceCategories.Add(category);
        await _context.SaveChangesAsync();

        return MapCategory(category);
    }

    public async Task<ServiceCategoryResponseDto?> UpdateAsync(string id, UpdateServiceCategoryDto dto)
    {
        var category = await _context.ServiceCategories.FindAsync(id);
        if (category is null)
        {
            return null;
        }

        category.NameOfCategory = dto.NameOfCategory.Trim();
        category.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return MapCategory(category);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var category = await _context.ServiceCategories.FindAsync(id);
        if (category is null)
        {
            return false;
        }

        _context.ServiceCategories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ServiceCategoryResponseDto MapCategory(ServiceCategoryData category)
    {
        return new ServiceCategoryResponseDto
        {
            Id = category.Id,
            NameOfCategory = category.NameOfCategory,
            IsActive = category.IsActive
        };
    }
}
