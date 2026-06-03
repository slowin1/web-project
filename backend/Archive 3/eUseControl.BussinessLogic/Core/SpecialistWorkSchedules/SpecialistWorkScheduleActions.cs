using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.Specialist;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.SpecialistWorkSchedules;

public class SpecialistWorkScheduleActions
{
    private readonly UserContext _context;

    protected SpecialistWorkScheduleActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SpecialistWorkScheduleResponseDto>> GetAllAsync()
    {
        var schedules = await _context.WorkSchedules.AsNoTracking().ToListAsync();
        return schedules.Select(MapSchedule);
    }

    public async Task<SpecialistWorkScheduleResponseDto?> GetByIdAsync(string id)
    {
        var schedule = await _context.WorkSchedules.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return schedule is null ? null : MapSchedule(schedule);
    }

    public async Task<SpecialistWorkScheduleResponseDto> CreateAsync(CreateSpecialistWorkScheduleDto dto)
    {
        var schedule = new SpecialistWorkSchedule
        {
            Id = Guid.NewGuid().ToString(),
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            SpecialistId = dto.SpecialistId
        };

        _context.WorkSchedules.Add(schedule);
        await _context.SaveChangesAsync();

        return MapSchedule(schedule);
    }

    public async Task<SpecialistWorkScheduleResponseDto?> UpdateAsync(string id, UpdateSpecialistWorkScheduleDto dto)
    {
        var schedule = await _context.WorkSchedules.FindAsync(id);
        if (schedule is null)
        {
            return null;
        }

        schedule.DayOfWeek = dto.DayOfWeek;
        schedule.StartTime = dto.StartTime;
        schedule.EndTime = dto.EndTime;
        schedule.SpecialistId = dto.SpecialistId;

        await _context.SaveChangesAsync();
        return MapSchedule(schedule);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var schedule = await _context.WorkSchedules.FindAsync(id);
        if (schedule is null)
        {
            return false;
        }

        _context.WorkSchedules.Remove(schedule);
        await _context.SaveChangesAsync();
        return true;
    }

    private static SpecialistWorkScheduleResponseDto MapSchedule(SpecialistWorkSchedule schedule)
    {
        return new SpecialistWorkScheduleResponseDto
        {
            Id = schedule.Id,
            DayOfWeek = schedule.DayOfWeek,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            SpecialistId = schedule.SpecialistId
        };
    }
}
