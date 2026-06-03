using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.services;

public class ServiceTimeSlot
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty;
    [Required]
    [DataType(DataType.DateTime)]
    public DateTime StartTime { get; set; }
    [Required]
    [DataType(DataType.DateTime)]
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } =  true;
    
    
    //внешние ключи
    [Required]
    public string SpecialistId { get; set; } = string.Empty;
    public string SpecialistName { get; set; } = string.Empty;

    //когда слот на бронирование услуги занят - ссылка на бронирование 
    public string? BookingId { get; set; } = string.Empty;
    public ServiceBookingData? Booking { get; set; }
}