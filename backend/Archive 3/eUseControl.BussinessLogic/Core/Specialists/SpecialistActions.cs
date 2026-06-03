using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.Specialist;
using eUseControl.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.Specialists;

public class SpecialistActions
{
    private readonly UserContext _context;

    protected SpecialistActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SpecialistResponseDto>> GetAllAsync()
    {
        var specialists = await _context.Specialists.AsNoTracking().ToListAsync();
        return specialists.Select(MapSpecialist);
    }

    public async Task<SpecialistResponseDto?> GetByIdAsync(string id)
    {
        var specialist = await _context.Specialists.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return specialist is null ? null : MapSpecialist(specialist);
    }

    public async Task<SpecialistResponseDto> CreateAsync(CreateSpecialistDto dto)
    {
        var userId = string.IsNullOrWhiteSpace(dto.UserId) ? null : dto.UserId.Trim();
        if (userId is not null)
        {
            await EnsureUserCanBeLinkedAsync(userId);
        }

        var specialist = new SpecialistData
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            FullName = dto.FullName.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            Bio = dto.Bio.Trim(),
            PhotoUrl = dto.PhotoUrl.Trim(),
            IsActive = dto.IsActive
        };

        _context.Specialists.Add(specialist);
        await SetLinkedUserRoleAsync(userId, UserRole.Specialist);
        await _context.SaveChangesAsync();

        return MapSpecialist(specialist);
    }

    public async Task<SpecialistResponseDto?> UpdateAsync(string id, UpdateSpecialistDto dto)
    {
        var specialist = await _context.Specialists.FindAsync(id);
        if (specialist is null)
        {
            return null;
        }

        var oldUserId = specialist.UserId;
        var newUserId = string.IsNullOrWhiteSpace(dto.UserId) ? null : dto.UserId.Trim();
        if (newUserId != oldUserId && newUserId is not null)
        {
            await EnsureUserCanBeLinkedAsync(newUserId, id);
        }

        specialist.UserId = newUserId;
        specialist.FullName = dto.FullName.Trim();
        specialist.PhoneNumber = dto.PhoneNumber.Trim();
        specialist.Bio = dto.Bio.Trim();
        specialist.PhotoUrl = dto.PhotoUrl.Trim();
        specialist.IsActive = dto.IsActive;

        if (oldUserId != newUserId)
        {
            await SetLinkedUserRoleAsync(oldUserId, UserRole.Client);
            await SetLinkedUserRoleAsync(newUserId, UserRole.Specialist);
        }

        await _context.SaveChangesAsync();
        return MapSpecialist(specialist);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var specialist = await _context.Specialists.FindAsync(id);
        if (specialist is null)
        {
            return false;
        }

        await SetLinkedUserRoleAsync(specialist.UserId, UserRole.Client);
        _context.Specialists.Remove(specialist);
        await _context.SaveChangesAsync();
        return true;
    }

    private static SpecialistResponseDto MapSpecialist(SpecialistData specialist)
    {
        return new SpecialistResponseDto
        {
            Id = specialist.Id,
            UserId = specialist.UserId,
            FullName = specialist.FullName,
            PhoneNumber = specialist.PhoneNumber,
            Bio = specialist.Bio,
            PhotoUrl = specialist.PhotoUrl,
            IsActive = specialist.IsActive
        };
    }

    private async Task EnsureUserCanBeLinkedAsync(string userId, string? currentSpecialistId = null)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            throw new InvalidOperationException("User not found.");
        }

        var userAlreadyLinked = await _context.Specialists.AnyAsync(s =>
            s.UserId == userId && (currentSpecialistId == null || s.Id != currentSpecialistId));

        if (userAlreadyLinked)
        {
            throw new InvalidOperationException("User is already linked to another specialist.");
        }
    }

    private async Task SetLinkedUserRoleAsync(string? userId, UserRole role)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return;
        }

        var user = await _context.Users.FindAsync(userId);
        if (user is not null)
        {
            user.Role = role;
        }
    }
}
