using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.LoginLogs;

public class LoginLogActions
{
    private readonly UserContext _context;

    protected LoginLogActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LoginLogResponseDto>> GetAllAsync()
    {
        var logs = await _context.LoginLogs.AsNoTracking().ToListAsync();
        return logs.Select(MapLog);
    }

    public async Task<LoginLogResponseDto?> GetByIdAsync(string id)
    {
        var log = await _context.LoginLogs.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return log is null ? null : MapLog(log);
    }

    public async Task<LoginLogResponseDto> CreateAsync(CreateLoginLogDto dto)
    {
        var log = new ULoginData
        {
            Id = Guid.NewGuid().ToString(),
            UserIp = Normalize(dto.UserIp, 15),
            LoginIp = Normalize(dto.LoginIp, 15),
            LoginDataTime = NormalizeDate(dto.LoginDataTime) ?? DateTime.UtcNow,
            VisitorId = Normalize(dto.VisitorId, 80),
            PagePath = Normalize(dto.PagePath, 240),
            Source = Normalize(dto.Source, 40),
            Device = Normalize(dto.Device, 40),
            Role = Normalize(dto.Role, 40),
            LogoutDataTime = NormalizeDate(dto.LogoutDataTime),
            SessionDurationSeconds = NormalizeDuration(dto.SessionDurationSeconds)
        };

        _context.LoginLogs.Add(log);
        await _context.SaveChangesAsync();

        return MapLog(log);
    }

    public async Task<LoginLogResponseDto?> UpdateAsync(string id, UpdateLoginLogDto dto)
    {
        var log = await _context.LoginLogs.FindAsync(id);
        if (log is null)
        {
            return null;
        }

        log.UserIp = Normalize(dto.UserIp, 15);
        log.LoginIp = Normalize(dto.LoginIp, 15);
        log.LoginDataTime = NormalizeDate(dto.LoginDataTime) ?? log.LoginDataTime;
        log.VisitorId = Normalize(dto.VisitorId, 80);
        log.PagePath = Normalize(dto.PagePath, 240);
        log.Source = Normalize(dto.Source, 40);
        log.Device = Normalize(dto.Device, 40);
        log.Role = Normalize(dto.Role, 40);
        log.LogoutDataTime = NormalizeDate(dto.LogoutDataTime);
        log.SessionDurationSeconds = NormalizeDuration(dto.SessionDurationSeconds);

        await _context.SaveChangesAsync();
        return MapLog(log);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var log = await _context.LoginLogs.FindAsync(id);
        if (log is null)
        {
            return false;
        }

        _context.LoginLogs.Remove(log);
        await _context.SaveChangesAsync();
        return true;
    }

    private static LoginLogResponseDto MapLog(ULoginData log)
    {
        return new LoginLogResponseDto
        {
            Id = log.Id,
            UserIp = log.UserIp,
            LoginIp = log.LoginIp,
            LoginDataTime = log.LoginDataTime,
            VisitorId = log.VisitorId,
            PagePath = log.PagePath,
            Source = log.Source,
            Device = log.Device,
            Role = log.Role,
            LogoutDataTime = log.LogoutDataTime,
            SessionDurationSeconds = log.SessionDurationSeconds
        };
    }

    private static string Normalize(string? value, int maxLength)
    {
        var normalized = (value ?? string.Empty).Trim();
        return normalized.Length <= maxLength ? normalized : normalized[..maxLength];
    }

    private static DateTime? NormalizeDate(DateTime? value)
    {
        if (value is null || value == default)
        {
            return null;
        }

        return value.Value.Kind == DateTimeKind.Utc
            ? value.Value
            : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc);
    }

    private static int? NormalizeDuration(int? value)
    {
        if (value is null)
        {
            return null;
        }

        return Math.Max(value.Value, 0);
    }
}
