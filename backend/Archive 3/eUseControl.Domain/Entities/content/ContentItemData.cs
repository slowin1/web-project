using System.ComponentModel.DataAnnotations;

namespace eUseControl.Domain.Entities.content;

public class ContentItemData
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(40, MinimumLength = 2)]
    public string ContentType { get; set; } = string.Empty;

    [Required]
    [StringLength(180, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(180)]
    public string Slug { get; set; } = string.Empty;

    [StringLength(300)]
    public string Subtitle { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;

    [StringLength(1000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
