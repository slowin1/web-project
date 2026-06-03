using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.User;
using eUseControl.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.Auth;

public class RegisterActions
{
    private readonly UserContext _context;
    private readonly JwtService _jwtService;

    protected RegisterActions(UserContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<UserResponseDto> RegisterAsync(UserRegisterDto dto)
    {
        await ValidateRegisterAsync(dto);

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

        var role = GetValidRole(user.Role);
        return MapUser(user, _jwtService.GenerateToken(user.Id, user.UserName, (int)role));
    }

    public async Task<UserResponseDto?> LoginAsync(UserLoginDto dto)
    {
        var userName = dto.UserName.Trim();
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserName == userName);

        if (user is null)
        {
            return null;
        }

        try
        {
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return null;
            }
        }
        catch
        {
            // If stored password is in an unexpected format, treat as authentication failure
            return null;
        }

        return MapUser(user, _jwtService.GenerateToken(user.Id, user.UserName, (int)user.Role));
    }

    private async Task ValidateRegisterAsync(UserRegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName))
        {
            throw new InvalidOperationException("UserName is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            throw new InvalidOperationException("Email is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new InvalidOperationException("Password is required.");
        }

        var userName = dto.UserName.Trim();
        var email = dto.Email.Trim();
        var exists = await _context.Users.AnyAsync(u => u.UserName == userName || u.Email == email);

        if (exists)
        {
            throw new InvalidOperationException("User with the same username or email already exists.");
        }
    }

    private static UserResponseDto MapUser(UserData user, string token)
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
            Token = token,
            Role = (int)GetValidRole(user.Role)
        };
    }

    private static UserRole GetValidRole(UserRole role)
    {
        return Enum.IsDefined(typeof(UserRole), role) ? role : UserRole.Client;
    }
}
