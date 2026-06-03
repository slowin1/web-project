using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.services;

public class CompletedSpecialistServiceData
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    public string BookingId { get; set; } = string.Empty;

    [Required]
    public string ServiceId { get; set; } = string.Empty;

    [Required]
    public string ServiceName { get; set; } = string.Empty;

    [Required]
    public string SpecialistId { get; set; } = string.Empty;

    [Required]
    public string SpecialistName { get; set; } = string.Empty;

    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    public DateTime BookingDate { get; set; }
    public DateTime CompletedOn { get; set; }
}
