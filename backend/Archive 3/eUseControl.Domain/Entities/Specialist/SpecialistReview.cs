using eUseControl.Domain.Entities.services;
using eUseControl.Domain.Entities.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.Specialist;

public class SpecialistReview
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 5, ErrorMessage = "Рейтинг должен быть от 1 до 5")]
    public int Rating { get; set; } 
    
    [Required]
    [StringLength(100), MinLength(1)]
    public string Comment { get; set; } = string.Empty;
    
    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; }
    
    //
    [Required]
    [StringLength(100)]
    public string ClientId { get; set; } = string.Empty;
    

    public UserData Client { get; set; } = null!;
    
    [Required]
    [StringLength(100)]
    public string BookingId { get; set; } = string.Empty;
    public ServiceBookingData? Booking { get; set; } = null!;
    
}