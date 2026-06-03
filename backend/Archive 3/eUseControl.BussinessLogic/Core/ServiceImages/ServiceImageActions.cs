using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.services;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.ServiceImages;

public class ServiceImageActions
{
    private const int MaxImagesPerService = 7;
    private readonly UserContext _context;

    protected ServiceImageActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServiceImageResponseDto>> GetAllAsync()
    {
        var images = await _context.ServiceImages
            .AsNoTracking()
            .OrderBy(image => image.UploadedAt)
            .ToListAsync();
        return images.Select(MapImage);
    }

    public async Task<ServiceImageResponseDto?> GetByIdAsync(string id)
    {
        var image = await _context.ServiceImages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return image is null ? null : MapImage(image);
    }

    public async Task<ServiceImageResponseDto> CreateAsync(CreateServiceImageDto dto)
    {
        await EnsureServiceImageLimitAsync(dto.ServiceId);

        var image = new ServiceImgData
        {
            Id = Guid.NewGuid().ToString(),
            ImageUrl = dto.ImageUrl.Trim(),
            FileName = dto.FileName.Trim(),
            ServiceName = dto.ServiceName.Trim(),
            ServiceId = dto.ServiceId,
            FileSize = dto.FileSize,
            UploadedAt = DateTime.UtcNow
        };

        _context.ServiceImages.Add(image);
        await _context.SaveChangesAsync();

        return MapImage(image);
    }

    public async Task<ServiceImageResponseDto?> UpdateAsync(string id, UpdateServiceImageDto dto)
    {
        var image = await _context.ServiceImages.FindAsync(id);
        if (image is null)
        {
            return null;
        }

        await EnsureServiceImageLimitAsync(dto.ServiceId, id);

        image.ImageUrl = dto.ImageUrl.Trim();
        image.FileName = dto.FileName.Trim();
        image.ServiceName = dto.ServiceName.Trim();
        image.ServiceId = dto.ServiceId;
        image.FileSize = dto.FileSize;

        await _context.SaveChangesAsync();
        return MapImage(image);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var image = await _context.ServiceImages.FindAsync(id);
        if (image is null)
        {
            return false;
        }

        _context.ServiceImages.Remove(image);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ServiceImageResponseDto MapImage(ServiceImgData image)
    {
        return new ServiceImageResponseDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            FileName = image.FileName,
            ServiceName = image.ServiceName,
            ServiceId = image.ServiceId,
            FileSize = image.FileSize,
            UploadedAt = image.UploadedAt
        };
    }

    private async Task EnsureServiceImageLimitAsync(string serviceId, string? currentImageId = null)
    {
        var normalizedServiceId = serviceId.Trim();
        if (string.IsNullOrWhiteSpace(normalizedServiceId))
        {
            throw new InvalidOperationException("ServiceId is required.");
        }

        var serviceExists = await _context.Services.AnyAsync(s => s.Id == normalizedServiceId);
        if (!serviceExists)
        {
            throw new InvalidOperationException("Service not found.");
        }

        var imageCount = await _context.ServiceImages.CountAsync(image =>
            image.ServiceId == normalizedServiceId &&
            (currentImageId == null || image.Id != currentImageId));

        if (imageCount >= MaxImagesPerService)
        {
            throw new InvalidOperationException($"Service can have up to {MaxImagesPerService} images.");
        }
    }
}
