using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.Specialist;
using eUseControl.Domain.Entities.User;
using eUseControl.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.Users;

public class UserActions
{
    private readonly UserContext _context;

    protected UserActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        var users = await _context.Users.AsNoTracking().ToListAsync();
        return users.Select(MapUser);
    }

    public async Task<UserResponseDto?> GetByIdAsync(string id)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return user is null ? null : MapUser(user);
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        var user = new UserData
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            UserName = dto.UserName.Trim(),
            Email = dto.Email.Trim(),
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone.Trim(),
            RegisteredOn = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return MapUser(user);
    }

    public async Task<UserResponseDto?> UpdateAsync(string id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null)
        {
            return null;
        }

        user.FirstName = dto.FirstName.Trim();
        user.LastName = dto.LastName.Trim();
        user.UserName = dto.UserName.Trim();
        user.Phone = dto.Phone.Trim();

        await _context.SaveChangesAsync();
        return MapUser(user);
    }

    public async Task<UserResponseDto?> UpdateRoleAsync(string id, UpdateUserRoleDto dto)
    {
        if (!Enum.IsDefined(typeof(UserRole), dto.Role))
        {
            throw new ArgumentOutOfRangeException(nameof(dto.Role), "Unknown user role.");
        }

        var user = await _context.Users.FindAsync(id);
        if (user is null)
        {
            return null;
        }

        var previousRole = user.Role;
        user.Role = dto.Role;

        if (dto.Role == UserRole.Specialist)
        {
            await EnsureSpecialistProfileAsync(user);
        }
        else if (previousRole == UserRole.Specialist)
        {
            await RemoveSpecialistProfileAsync(user.Id);
        }

        await _context.SaveChangesAsync();
        return MapUser(user);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null)
        {
            return false;
        }

        await RemoveSpecialistProfileAsync(user.Id);
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    private static UserResponseDto MapUser(UserData user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Phone = user.Phone,
            RegisteredOn = user.RegisteredOn,
            Role = (int)GetValidRole(user.Role)
        };
    }

    private static UserRole GetValidRole(UserRole role)
    {
        return Enum.IsDefined(typeof(UserRole), role) ? role : UserRole.Client;
    }

    private async Task EnsureSpecialistProfileAsync(UserData user)
    {
        var exists = await _context.Specialists.AnyAsync(s => s.UserId == user.Id);
        if (exists)
        {
            return;
        }

        var fullName = $"{user.FirstName} {user.LastName}".Trim();
        var existingSpecialist = await _context.Specialists.FirstOrDefaultAsync(s =>
            s.UserId == null &&
            (s.PhoneNumber == user.Phone || s.FullName == fullName));

        if (existingSpecialist is not null)
        {
            existingSpecialist.UserId = user.Id;
            return;
        }

        _context.Specialists.Add(new SpecialistData
        {
            Id = Guid.NewGuid().ToString(),
            UserId = user.Id,
            FullName = fullName,
            PhoneNumber = user.Phone,
            Bio = "Specialist profile",
            PhotoUrl = "https://example.com/specialist-photo.png",
            IsActive = true
        });
    }

    private async Task RemoveSpecialistProfileAsync(string userId)
    {
        var specialist = await _context.Specialists.FirstOrDefaultAsync(s => s.UserId == userId);
        if (specialist is null)
        {
            return;
        }

        _context.Specialists.Remove(specialist);
    }
}
