namespace eUseControl.Domain.DTOs;

public class CreateSpecialistWorkScheduleDto
{
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string SpecialistId { get; set; } = string.Empty;
}

public class UpdateSpecialistWorkScheduleDto
{
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string SpecialistId { get; set; } = string.Empty;
}

public class SpecialistWorkScheduleResponseDto
{
    public string Id { get; set; } = string.Empty;
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string SpecialistId { get; set; } = string.Empty;
}
