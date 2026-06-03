namespace eUseControl.Domain.DTOs;

public class CreateServiceDto
{
    public string NameOfService { get; set; } = string.Empty;
    public string NameOfMaster { get; set; } = string.Empty;
    public string DescriptionOfService { get; set; } = string.Empty;
    public int DurationOfService { get; set; }
    public decimal PriceOfService { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}

public class UpdateServiceDto
{
    public string NameOfService { get; set; } = string.Empty;
    public string NameOfMaster { get; set; } = string.Empty;
    public string DescriptionOfService { get; set; } = string.Empty;
    public int DurationOfService { get; set; }
    public decimal PriceOfService { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}

public class ServiceResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string NameOfService { get; set; } = string.Empty;
    public string NameOfMaster { get; set; } = string.Empty;
    public string DescriptionOfService { get; set; } = string.Empty;
    public int DurationOfService { get; set; }
    public decimal PriceOfService { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}
