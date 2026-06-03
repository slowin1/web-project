using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


using eUseControl.Domain.Entities.services;
using eUseControl.Domain.Entities.User;

namespace eUseControl.Domain.Entities.Specialist;

public class SpecialistData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty;

    public string? UserId { get; set; }
    public UserData? User { get; set; }
    
    [Required]
    [StringLength(50), MinLength(2)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15), MinLength(5)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50), MinLength(5)]
    public string Bio { get; set; } = string.Empty;
    
    [Required]
    [StringLength(500)]
    [DataType(DataType.ImageUrl)]
    [Url(ErrorMessage = "Некорректный формат URL")]
    public string PhotoUrl { get; set; } = string.Empty;
    
    //на случай если мастер вышел в отпуск
    public bool IsActive { get; set; } = true;
    
    public ICollection<ServiceTimeSlot> TimeSlots { get; set; } = new List<ServiceTimeSlot>();
}
