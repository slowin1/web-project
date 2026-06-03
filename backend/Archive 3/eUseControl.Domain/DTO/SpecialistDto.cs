namespace eUseControl.Domain.DTOs;

public class CreateSpecialistDto
{
    public string? UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class UpdateSpecialistDto
{
    public string? UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SpecialistResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
