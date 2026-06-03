using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eUseControl.Domain.Entities.services;

public class ServiceImgData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty; 
    //cloudinary там будут храниться изображения
    [Required]
    [StringLength(500)]
    [DataType(DataType.ImageUrl)]
    public string ImageUrl { get; set; } = string.Empty;
    
    [Required]
    [StringLength(255)]
    public string FileName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string ServiceName { get; set; } = string.Empty;
    
    [Required]
    public string ServiceId { get; set; } = string.Empty;
    [Range(1, 10_485_760, ErrorMessage = "Размер файла не должен превышать 10MB")]
    public long FileSize { get; set; }
    
    [DataType(DataType.DateTime)]
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    public ServiceData Service { get; set; } = null!;
}
