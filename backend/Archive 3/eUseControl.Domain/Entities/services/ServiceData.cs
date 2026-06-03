using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.services;

public class ServiceData
{   
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(50), MinLength(5)]
    public string NameOfService { get; set; } = string.Empty;//название услуги
    
    [Required]
    [StringLength(50), MinLength(5)]
    public string NameOfMaster { get; set; } = string.Empty; //Имя мастера который будет оказывать услугу
   
    [Required]
   [StringLength(200), MinLength(30)]
    public string DescriptionOfService { get; set; } = string.Empty;//описание услуги
    [Required]
    [StringLength(10), MinLength(3)]
    public int DurationOfService { get; set; }
    
    [Required]
    [Range(0.01, 100000.00, ErrorMessage = "Цена должна быть от 0.01 до 100000")]
    [DataType(DataType.Currency)]
    [Column(TypeName = "decimal(10, 2)")]  
    public Decimal PriceOfService { get; set; } 
    
    //связь с категорией 
    public string CategoryId { get; set; } = string.Empty;
    public ServiceCategoryData Category { get; set; } = null!;
}