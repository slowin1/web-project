using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.Specialist;

public class SpecialistWorkSchedule
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty;
    
    [Required]
    public DayOfWeek DayOfWeek { get; set; }
    [Required]
    public TimeOnly StartTime { get; set; }
    [Required]
    public TimeOnly EndTime { get; set; }
    
    public string SpecialistId { get; set; } = string.Empty;
    public SpecialistData SpecialistData { get; set; } = new SpecialistData();
}