namespace eUseControl.Domain.DTOs;

public class CreateServiceCategoryDto
{
    public string NameOfCategory { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class UpdateServiceCategoryDto
{
    public string NameOfCategory { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class ServiceCategoryResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string NameOfCategory { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
