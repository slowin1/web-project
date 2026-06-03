using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace eUseControl.Domain.Entities.User;
// по сути жунал куда будут записываться данные про последний вход где и когда
public class ULoginData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = string.Empty; // id самой записи лога
    [Required]
    [StringLength(15), MinLength(8)]//Максимальная длина для ip
    public string UserIp { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15), MinLength(8)]
    public string LoginIp { get; set; } = string.Empty;
    
    [Required]
    [DataType(DataType.DateTime)]
    public DateTime LoginDataTime { get; set; }

    [StringLength(80)]
    public string VisitorId { get; set; } = string.Empty;

    [StringLength(240)]
    public string PagePath { get; set; } = string.Empty;

    [StringLength(40)]
    public string Source { get; set; } = string.Empty;

    [StringLength(40)]
    public string Device { get; set; } = string.Empty;

    [StringLength(40)]
    public string Role { get; set; } = string.Empty;

    public DateTime? LogoutDataTime { get; set; }

    public int? SessionDurationSeconds { get; set; }

} 
