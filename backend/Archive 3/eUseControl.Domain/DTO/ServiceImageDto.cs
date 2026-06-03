namespace eUseControl.Domain.DTOs;

public class CreateServiceImageDto
{
    public string ImageUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string ServiceId { get; set; } = string.Empty;
    public long FileSize { get; set; }
}

public class UpdateServiceImageDto
{
    public string ImageUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string ServiceId { get; set; } = string.Empty;
    public long FileSize { get; set; }
}

public class ServiceImageResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string ServiceId { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; }
}
