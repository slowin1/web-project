namespace eUseControl.Domain.DTOs;

public class CreateLoginLogDto
{
    public string UserIp { get; set; } = string.Empty;
    public string LoginIp { get; set; } = string.Empty;
    public DateTime LoginDataTime { get; set; }
    public string VisitorId { get; set; } = string.Empty;
    public string PagePath { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? LogoutDataTime { get; set; }
    public int? SessionDurationSeconds { get; set; }
}

public class UpdateLoginLogDto
{
    public string UserIp { get; set; } = string.Empty;
    public string LoginIp { get; set; } = string.Empty;
    public DateTime LoginDataTime { get; set; }
    public string VisitorId { get; set; } = string.Empty;
    public string PagePath { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? LogoutDataTime { get; set; }
    public int? SessionDurationSeconds { get; set; }
}

public class LoginLogResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string UserIp { get; set; } = string.Empty;
    public string LoginIp { get; set; } = string.Empty;
    public DateTime LoginDataTime { get; set; }
    public string VisitorId { get; set; } = string.Empty;
    public string PagePath { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? LogoutDataTime { get; set; }
    public int? SessionDurationSeconds { get; set; }
}
