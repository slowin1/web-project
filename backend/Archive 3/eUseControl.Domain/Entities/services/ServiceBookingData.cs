using System.ComponentModel.DataAnnotations;
using eUseControl.Domain.Enums;


namespace eUseControl.Domain.Entities.services;

public class ServiceBookingData
{
    [Key]
    public string Id { get; set; } = string.Empty;
    //все про запись на услуги имя описание и т. д.
    [Required]
    public string BookingId { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string BookingName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(200, MinimumLength = 30)]
    public string BookingDescription { get; set; } = string.Empty;
    public string? ClientUserId { get; set; }
    //время записи
    [Required]
    [DataType(DataType.Date)]
    public DateTime BookingTime { get; set; }
    public DateTime BookingDate { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pedding;
    public string? SpecialistId { get; set; }
    public DateTime? SpecialistConfirmedOn { get; set; }
    public DateTime? CompletedOn { get; set; }
}
