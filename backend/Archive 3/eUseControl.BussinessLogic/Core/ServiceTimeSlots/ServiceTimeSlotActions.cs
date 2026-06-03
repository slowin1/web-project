using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.services;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.ServiceTimeSlots;

public class ServiceTimeSlotActions
{
    private readonly UserContext _context;

    protected ServiceTimeSlotActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServiceTimeSlotResponseDto>> GetAllAsync()
    {
        var slots = await _context.TimeSlots.AsNoTracking().ToListAsync();
        return slots.Select(MapSlot);
    }

    public async Task<ServiceTimeSlotResponseDto?> GetByIdAsync(string id)
    {
        var slot = await _context.TimeSlots.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return slot is null ? null : MapSlot(slot);
    }

    public async Task<ServiceTimeSlotResponseDto> CreateAsync(CreateServiceTimeSlotDto dto)
    {
        var slot = new ServiceTimeSlot
        {
            Id = Guid.NewGuid().ToString(),
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            IsAvailable = dto.IsAvailable,
            SpecialistId = dto.SpecialistId,
            SpecialistName = dto.SpecialistName.Trim(),
            BookingId = dto.BookingId
        };

        _context.TimeSlots.Add(slot);
        await _context.SaveChangesAsync();

        return MapSlot(slot);
    }

    public async Task<ServiceTimeSlotResponseDto?> UpdateAsync(string id, UpdateServiceTimeSlotDto dto)
    {
        var slot = await _context.TimeSlots.FindAsync(id);
        if (slot is null)
        {
            return null;
        }

        slot.StartTime = dto.StartTime;
        slot.EndTime = dto.EndTime;
        slot.IsAvailable = dto.IsAvailable;
        slot.SpecialistId = dto.SpecialistId;
        slot.SpecialistName = dto.SpecialistName.Trim();
        slot.BookingId = dto.BookingId;

        await _context.SaveChangesAsync();
        return MapSlot(slot);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var slot = await _context.TimeSlots.FindAsync(id);
        if (slot is null)
        {
            return false;
        }

        _context.TimeSlots.Remove(slot);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ServiceTimeSlotResponseDto MapSlot(ServiceTimeSlot slot)
    {
        return new ServiceTimeSlotResponseDto
        {
            Id = slot.Id,
            StartTime = slot.StartTime,
            EndTime = slot.EndTime,
            IsAvailable = slot.IsAvailable,
            SpecialistId = slot.SpecialistId,
            SpecialistName = slot.SpecialistName,
            BookingId = slot.BookingId
        };
    }
}
