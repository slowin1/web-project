using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.services;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.Services;

public class ServiceActions
{
    private readonly UserContext _context;

    protected ServiceActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServiceResponseDto>> GetAllAsync()
    {
        var services = await _context.Services.AsNoTracking().ToListAsync();
        return services.Select(MapService);
    }

    public async Task<ServiceResponseDto?> GetByIdAsync(string id)
    {
        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return service is null ? null : MapService(service);
    }

    public async Task<ServiceResponseDto> CreateAsync(CreateServiceDto dto)
    {
        var service = new ServiceData
        {
            Id = Guid.NewGuid().ToString(),
            NameOfService = dto.NameOfService.Trim(),
            NameOfMaster = dto.NameOfMaster.Trim(),
            DescriptionOfService = dto.DescriptionOfService.Trim(),
            DurationOfService = dto.DurationOfService,
            PriceOfService = dto.PriceOfService,
            CategoryId = dto.CategoryId
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return MapService(service);
    }

    public async Task<ServiceResponseDto?> UpdateAsync(string id, UpdateServiceDto dto)
    {
        var service = await _context.Services.FindAsync(id);
        if (service is null)
        {
            return null;
        }

        service.NameOfService = dto.NameOfService.Trim();
        service.NameOfMaster = dto.NameOfMaster.Trim();
        service.DescriptionOfService = dto.DescriptionOfService.Trim();
        service.DurationOfService = dto.DurationOfService;
        service.PriceOfService = dto.PriceOfService;
        service.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();
        return MapService(service);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service is null)
        {
            return false;
        }

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ServiceResponseDto MapService(ServiceData service)
    {
        return new ServiceResponseDto
        {
            Id = service.Id,
            NameOfService = service.NameOfService,
            NameOfMaster = service.NameOfMaster,
            DescriptionOfService = service.DescriptionOfService,
            DurationOfService = service.DurationOfService,
            PriceOfService = service.PriceOfService,
            CategoryId = service.CategoryId
        };
    }
}
