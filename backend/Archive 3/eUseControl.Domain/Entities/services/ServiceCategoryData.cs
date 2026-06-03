using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.services;

public class ServiceCategoryData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string NameOfCategory { get; set; } = string.Empty;
    
    //к примеру на сайте захотят удалить эту слуги или она будет не доступна
    public bool IsActive { get; set; } = true;
    
    //все услуги данный категории 
    public ICollection<ServiceData> Services { get; set; } = new List<ServiceData>();
}