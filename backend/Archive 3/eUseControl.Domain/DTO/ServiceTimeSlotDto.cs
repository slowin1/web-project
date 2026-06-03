namespace eUseControl.Domain.DTOs;

public class CreateServiceTimeSlotDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string SpecialistId { get; set; } = string.Empty;
    public string SpecialistName { get; set; } = string.Empty;
    public string? BookingId { get; set; }
}

public class UpdateServiceTimeSlotDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string SpecialistId { get; set; } = string.Empty;
    public string SpecialistName { get; set; } = string.Empty;
    public string? BookingId { get; set; }
}

public class ServiceTimeSlotResponseDto
{
    public string Id { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; }
    public string SpecialistId { get; set; } = string.Empty;
    public string SpecialistName { get; set; } = string.Empty;
    public string? BookingId { get; set; }
}
