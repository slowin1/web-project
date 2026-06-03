using eUseControl.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using eUseControl.Domain.Entities.services;

namespace eUseControl.Domain.Entities.User;

public class UserData
{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = string.Empty;
        //имя фамилия 
        [Required]
        [StringLength(50), MinLength(5)]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        [StringLength(50), MinLength(5)]
        public string LastName { get; set; } = string.Empty;
        //ник пользователя
        [Required]
        [StringLength(50), MinLength(5)]
        public string UserName { get; set; } = string.Empty;
        //данные пользователяч
        [Required]
        [StringLength(50), MinLength(5)]
        public string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(100), MinLength(5)]
        public string Password { get; set; } = string.Empty;
        [Required]
        [StringLength(50), MinLength(5)]
        public string Phone { get; set; }  = string.Empty;
        //время регистрации 
        [DataType(DataType.DateTime)]
        public DateTime RegisteredOn { get; set; }

        //роль пользователя
        public UserRole Role { get; set; } = UserRole.Client;

        public ICollection<ServiceBookingData> ServiceBookingData { get; set; } = new List<ServiceBookingData>();
    
}