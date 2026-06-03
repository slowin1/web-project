namespace eUseControl.Domain.DTOs;

using eUseControl.Domain.Enums;

public class CreateServiceBookingDto
{
    public string BookingId { get; set; } = string.Empty;
    public string BookingName { get; set; } = string.Empty;
    public string BookingDescription { get; set; } = string.Empty;
    public string? ClientUserId { get; set; }
    public DateTime BookingTime { get; set; }
    public DateTime BookingDate { get; set; }
    public string? SpecialistId { get; set; }
}

public class UpdateServiceBookingDto
{
    public string BookingId { get; set; } = string.Empty;
    public string BookingName { get; set; } = string.Empty;
    public string BookingDescription { get; set; } = string.Empty;
    public string? ClientUserId { get; set; }
    public DateTime BookingTime { get; set; }
    public DateTime BookingDate { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pedding;
    public string? SpecialistId { get; set; }
}

public class UpdateServiceBookingStatusDto
{
    public BookingStatus Status { get; set; }
}

public class ServiceBookingResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string BookingId { get; set; } = string.Empty;
    public string BookingName { get; set; } = string.Empty;
    public string BookingDescription { get; set; } = string.Empty;
    public string? ClientUserId { get; set; }
    public DateTime BookingTime { get; set; }
    public DateTime BookingDate { get; set; }
    public BookingStatus Status { get; set; }
    public string? SpecialistId { get; set; }
    public DateTime? SpecialistConfirmedOn { get; set; }
    public DateTime? CompletedOn { get; set; }
}

public class CompletedSpecialistServiceResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string BookingId { get; set; } = string.Empty;
    public string ServiceId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string SpecialistId { get; set; } = string.Empty;
    public string SpecialistName { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime BookingDate { get; set; }
    public DateTime CompletedOn { get; set; }
}
