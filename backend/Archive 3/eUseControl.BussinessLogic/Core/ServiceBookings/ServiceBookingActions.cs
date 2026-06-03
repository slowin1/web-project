using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.services;
using eUseControl.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace eUseControl.BussinessLogic.Core.ServiceBookings;

public class ServiceBookingActions
{
    private readonly UserContext _context;
    private static readonly string[] DefaultTimeSlots =
    [
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00"
    ];

    protected ServiceBookingActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ServiceBookingResponseDto>> GetAllAsync()
    {
        var bookings = await _context.Bookings.AsNoTracking().ToListAsync();
        return bookings.Select(MapBooking);
    }

    public async Task<IEnumerable<ServiceBookingResponseDto>> GetBySpecialistAsync(string specialistId)
    {
        var specialist = await _context.Specialists.AsNoTracking().FirstOrDefaultAsync(s => s.Id == specialistId);
        if (specialist is null)
        {
            return Enumerable.Empty<ServiceBookingResponseDto>();
        }

        var services = await _context.Services.AsNoTracking().ToListAsync();
        var serviceIds = services
            .Where(service => SameText(service.NameOfMaster, specialist.FullName))
            .Select(service => service.Id)
            .ToHashSet();

        var bookings = await _context.Bookings.AsNoTracking().ToListAsync();
        return bookings
            .Where(booking =>
                booking.SpecialistId == specialistId ||
                serviceIds.Contains(booking.BookingId) ||
                SameText(ParseDescriptionField(booking.BookingDescription, "Специалист"), specialist.FullName))
            .Select(MapBooking);
    }

    public async Task<IEnumerable<ServiceBookingResponseDto>> GetByUserAsync(string userId)
    {
        var bookings = await _context.Bookings
            .AsNoTracking()
            .Where(booking => booking.ClientUserId == userId)
            .ToListAsync();
        return bookings.Select(MapBooking);
    }

    public async Task<ServiceBookingResponseDto?> GetByIdAsync(string id)
    {
        var booking = await _context.Bookings.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return booking is null ? null : MapBooking(booking);
    }

    public async Task<IEnumerable<string>> GetAvailableSlotsAsync(string serviceId, DateTime date)
    {
        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == serviceId);
        var specialistId = await ResolveSpecialistIdAsync(null, serviceId, string.Empty);
        var day = NormalizeUtc(date).Date;
        var dayEnd = day.AddDays(1);
        var duration = Math.Max(service?.DurationOfService ?? 30, 30);
        var serviceIds = await GetSpecialistServiceIdsAsync(serviceId, specialistId);
        var serviceDurations = await _context.Services
            .AsNoTracking()
            .Where(item => serviceIds.Contains(item.Id))
            .Select(item => new { item.Id, item.DurationOfService })
            .ToDictionaryAsync(item => item.Id, item => Math.Max(item.DurationOfService, 30));
        var occupiedSlots = string.IsNullOrWhiteSpace(specialistId)
            ? []
            : await _context.TimeSlots
                .AsNoTracking()
                .Where(slot =>
                    !slot.IsAvailable &&
                    slot.SpecialistId == specialistId &&
                    slot.StartTime >= day &&
                    slot.StartTime < dayEnd)
                .ToListAsync();
        var occupiedBookings = await _context.Bookings
            .AsNoTracking()
            .Where(booking =>
                (
                    booking.Status == BookingStatus.Pedding ||
                    booking.Status == BookingStatus.Confirmed ||
                    booking.Status == BookingStatus.Completed
                ) &&
                booking.BookingTime >= day &&
                booking.BookingTime < dayEnd &&
                (
                    (!string.IsNullOrWhiteSpace(specialistId) && booking.SpecialistId == specialistId) ||
                    serviceIds.Contains(booking.BookingId)
                ))
            .ToListAsync();
        var availableSlots = new List<string>();

        foreach (var slot in DefaultTimeSlots)
        {
            if (!TimeSpan.TryParse(slot, out var time))
            {
                continue;
            }

            var slotStart = day.Add(time);
            var slotEnd = slotStart.AddMinutes(duration);
            var hasSlotConflict = occupiedSlots.Any(occupied =>
                Overlaps(slotStart, slotEnd, NormalizeUtc(occupied.StartTime), NormalizeUtc(occupied.EndTime)));
            var hasBookingConflict = occupiedBookings.Any(booking =>
            {
                var bookingDuration = serviceDurations.GetValueOrDefault(booking.BookingId, 30);
                var bookingStart = NormalizeUtc(booking.BookingTime);
                return Overlaps(slotStart, slotEnd, bookingStart, bookingStart.AddMinutes(bookingDuration));
            });

            if (!hasSlotConflict && !hasBookingConflict)
            {
                availableSlots.Add(slot);
            }
        }

        return availableSlots;
    }

    public async Task<ServiceBookingResponseDto> CreateAsync(CreateServiceBookingDto dto)
    {
        var specialistId = await ResolveSpecialistIdAsync(dto.SpecialistId, dto.BookingId, dto.BookingDescription);
        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == dto.BookingId);
        var bookingTime = NormalizeUtc(dto.BookingTime);
        var hasConflict = await HasBookingConflictAsync(
            excludeBookingId: null,
            dto.BookingId,
            specialistId,
            bookingTime,
            service?.DurationOfService ?? 30);

        if (hasConflict)
        {
            throw new InvalidOperationException("Это время уже занято у выбранного специалиста.");
        }

        var booking = new ServiceBookingData
        {
            Id = Guid.NewGuid().ToString(),
            BookingId = dto.BookingId.Trim(),
            BookingName = dto.BookingName.Trim(),
            BookingDescription = dto.BookingDescription.Trim(),
            ClientUserId = NormalizeOptional(dto.ClientUserId),
            BookingTime = bookingTime,
            BookingDate = NormalizeUtc(dto.BookingDate),
            Status = BookingStatus.Pedding,
            SpecialistId = specialistId
        };

        _context.Bookings.Add(booking);
        await SyncTimeSlotAsync(booking, service);
        await _context.SaveChangesAsync();

        return MapBooking(booking);
    }

    public async Task<ServiceBookingResponseDto?> UpdateAsync(string id, UpdateServiceBookingDto dto)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null)
        {
            return null;
        }

        var specialistId = await ResolveSpecialistIdAsync(dto.SpecialistId, dto.BookingId, dto.BookingDescription);
        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == dto.BookingId);
        var bookingTime = NormalizeUtc(dto.BookingTime);
        var hasConflict = await HasBookingConflictAsync(
            id,
            dto.BookingId,
            specialistId,
            bookingTime,
            service?.DurationOfService ?? 30);

        if (hasConflict)
        {
            throw new InvalidOperationException("Это время уже занято у выбранного специалиста.");
        }

        booking.BookingId = dto.BookingId.Trim();
        booking.BookingName = dto.BookingName.Trim();
        booking.BookingDescription = dto.BookingDescription.Trim();
        booking.ClientUserId = NormalizeOptional(dto.ClientUserId);
        booking.BookingTime = bookingTime;
        booking.BookingDate = NormalizeUtc(dto.BookingDate);
        booking.Status = dto.Status;
        booking.SpecialistId = specialistId;

        await SyncTimeSlotAsync(booking, service);
        await _context.SaveChangesAsync();
        return MapBooking(booking);
    }

    public async Task<ServiceBookingResponseDto?> UpdateStatusAsync(string id, UpdateServiceBookingStatusDto dto)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null)
        {
            return null;
        }

        booking.Status = dto.Status;
        if (dto.Status == BookingStatus.Confirmed)
        {
            booking.SpecialistConfirmedOn = DateTime.UtcNow;
        }

        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == booking.BookingId);
        await SyncTimeSlotAsync(booking, service);
        await _context.SaveChangesAsync();
        return MapBooking(booking);
    }

    public async Task<CompletedSpecialistServiceResponseDto?> CompleteAsync(string id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null)
        {
            return null;
        }

        if (booking.Status == BookingStatus.Completed)
        {
            var existing = await _context.CompletedSpecialistServices
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.BookingId == booking.Id);
            if (existing is null)
            {
                return null;
            }

            var services = await _context.Services.AsNoTracking().ToListAsync();
            return MapCompleted(existing, ResolveCompletedPrice(existing, services));
        }

        var service = await ResolveServiceForBookingAsync(booking);
        var specialist = await ResolveSpecialistAsync(booking, service);
        var completedOn = DateTime.UtcNow;

        booking.Status = BookingStatus.Completed;
        booking.CompletedOn = completedOn;
        await SyncTimeSlotAsync(booking, service);

        var completed = new CompletedSpecialistServiceData
        {
            Id = Guid.NewGuid().ToString(),
            BookingId = booking.Id,
            ServiceId = service?.Id ?? booking.BookingId,
            ServiceName = service?.NameOfService ?? ParseServiceName(booking),
            SpecialistId = specialist?.Id ?? booking.SpecialistId ?? string.Empty,
            SpecialistName = specialist?.FullName ?? ParseDescriptionField(booking.BookingDescription, "Специалист"),
            ClientName = ParseDescriptionField(booking.BookingDescription, "Клиент"),
            ClientPhone = ParseDescriptionField(booking.BookingDescription, "Телефон"),
            Price = service?.PriceOfService ?? 0,
            BookingDate = booking.BookingDate,
            CompletedOn = completedOn
        };

        _context.CompletedSpecialistServices.Add(completed);
        await _context.SaveChangesAsync();

        return MapCompleted(completed);
    }

    public async Task<IEnumerable<CompletedSpecialistServiceResponseDto>> GetCompletedAsync()
    {
        var completed = await _context.CompletedSpecialistServices
            .AsNoTracking()
            .OrderByDescending(item => item.CompletedOn)
            .ToListAsync();
        var services = await _context.Services.AsNoTracking().ToListAsync();

        return completed.Select(item => MapCompleted(item, ResolveCompletedPrice(item, services)));
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null)
        {
            return false;
        }

        _context.Bookings.Remove(booking);
        await RemoveTimeSlotAsync(booking.Id);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ServiceBookingResponseDto MapBooking(ServiceBookingData booking)
    {
        return new ServiceBookingResponseDto
        {
            Id = booking.Id,
            BookingId = booking.BookingId,
            BookingName = booking.BookingName,
            BookingDescription = booking.BookingDescription,
            ClientUserId = booking.ClientUserId,
            BookingTime = booking.BookingTime,
            BookingDate = booking.BookingDate,
            Status = booking.Status,
            SpecialistId = booking.SpecialistId,
            SpecialistConfirmedOn = booking.SpecialistConfirmedOn,
            CompletedOn = booking.CompletedOn
        };
    }

    private static CompletedSpecialistServiceResponseDto MapCompleted(
        CompletedSpecialistServiceData item,
        decimal? priceOverride = null)
    {
        return new CompletedSpecialistServiceResponseDto
        {
            Id = item.Id,
            BookingId = item.BookingId,
            ServiceId = item.ServiceId,
            ServiceName = item.ServiceName,
            SpecialistId = item.SpecialistId,
            SpecialistName = item.SpecialistName,
            ClientName = item.ClientName,
            ClientPhone = item.ClientPhone,
            Price = priceOverride ?? item.Price,
            BookingDate = item.BookingDate,
            CompletedOn = item.CompletedOn
        };
    }

    private static DateTime NormalizeUtc(DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private async Task<string?> ResolveSpecialistIdAsync(string? specialistId, string serviceId, string description)
    {
        if (!string.IsNullOrWhiteSpace(specialistId))
        {
            return specialistId.Trim();
        }

        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == serviceId);
        var specialistName = service?.NameOfMaster;
        if (string.IsNullOrWhiteSpace(specialistName))
        {
            specialistName = ParseDescriptionField(description, "Специалист");
        }

        if (string.IsNullOrWhiteSpace(specialistName))
        {
            return null;
        }

        var specialist = await _context.Specialists.AsNoTracking().FirstOrDefaultAsync(s => s.FullName == specialistName);
        return specialist?.Id;
    }

    private async Task<bool> HasBookingConflictAsync(
        string? excludeBookingId,
        string serviceId,
        string? specialistId,
        DateTime bookingTime,
        int durationMinutes)
    {
        var blockedStatuses = new[]
        {
            BookingStatus.Pedding,
            BookingStatus.Confirmed
        };
        var start = NormalizeUtc(bookingTime);
        var end = start.AddMinutes(Math.Max(durationMinutes, 30));
        var dayStart = start.Date;
        var dayEnd = dayStart.AddDays(1);
        var serviceIds = await GetSpecialistServiceIdsAsync(serviceId, specialistId);

        if (!string.IsNullOrWhiteSpace(specialistId))
        {
            var occupiedSlots = await _context.TimeSlots
                .AsNoTracking()
                .Where(slot =>
                    slot.BookingId != excludeBookingId &&
                    !slot.IsAvailable &&
                    slot.SpecialistId == specialistId &&
                    slot.StartTime >= dayStart &&
                    slot.StartTime < dayEnd)
                .ToListAsync();

            if (occupiedSlots.Any(slot => start < NormalizeUtc(slot.EndTime) && end > NormalizeUtc(slot.StartTime)))
            {
                return true;
            }
        }

        var bookings = await _context.Bookings
            .AsNoTracking()
            .Where(booking =>
                booking.Id != excludeBookingId &&
                blockedStatuses.Contains(booking.Status) &&
                booking.BookingTime >= dayStart &&
                booking.BookingTime < dayEnd &&
                (
                    (!string.IsNullOrWhiteSpace(specialistId) && booking.SpecialistId == specialistId) ||
                    serviceIds.Contains(booking.BookingId)
                ))
            .ToListAsync();

        foreach (var booking in bookings)
        {
            var existingDuration = await GetServiceDurationAsync(booking.BookingId);
            var existingStart = NormalizeUtc(booking.BookingTime);
            var existingEnd = existingStart.AddMinutes(existingDuration);

            if (start < existingEnd && end > existingStart)
            {
                return true;
            }
        }

        return false;
    }

    private async Task<HashSet<string>> GetSpecialistServiceIdsAsync(string serviceId, string? specialistId)
    {
        var serviceIds = new HashSet<string> { serviceId };
        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == serviceId);
        string? specialistName = service?.NameOfMaster;

        if (!string.IsNullOrWhiteSpace(specialistId))
        {
            var specialist = await _context.Specialists.AsNoTracking().FirstOrDefaultAsync(s => s.Id == specialistId);
            specialistName = specialist?.FullName ?? specialistName;
        }

        if (string.IsNullOrWhiteSpace(specialistName))
        {
            return serviceIds;
        }

        var specialistServices = await _context.Services
            .AsNoTracking()
            .Where(s => s.NameOfMaster == specialistName)
            .Select(s => s.Id)
            .ToListAsync();

        foreach (var id in specialistServices)
        {
            serviceIds.Add(id);
        }

        return serviceIds;
    }

    private async Task<int> GetServiceDurationAsync(string serviceId)
    {
        var duration = await _context.Services
            .AsNoTracking()
            .Where(service => service.Id == serviceId)
            .Select(service => (int?)service.DurationOfService)
            .FirstOrDefaultAsync();

        return Math.Max(duration ?? 30, 30);
    }

    private async Task SyncTimeSlotAsync(ServiceBookingData booking, ServiceData? service)
    {
        var slot = await _context.TimeSlots.FirstOrDefaultAsync(item => item.BookingId == booking.Id);
        var specialist = await ResolveSpecialistAsync(booking, service);
        var specialistId = specialist?.Id ?? booking.SpecialistId;

        if (string.IsNullOrWhiteSpace(specialistId))
        {
            return;
        }

        var start = NormalizeUtc(booking.BookingTime);
        var duration = Math.Max(service?.DurationOfService ?? await GetServiceDurationAsync(booking.BookingId), 30);
        var isOccupied = IsOccupyingStatus(booking.Status);

        if (slot is null)
        {
            slot = new ServiceTimeSlot
            {
                Id = Guid.NewGuid().ToString(),
                BookingId = booking.Id
            };
            _context.TimeSlots.Add(slot);
        }

        slot.StartTime = start;
        slot.EndTime = start.AddMinutes(duration);
        slot.IsAvailable = !isOccupied;
        slot.SpecialistId = specialistId;
        slot.SpecialistName = specialist?.FullName
            ?? service?.NameOfMaster
            ?? ParseDescriptionField(booking.BookingDescription, "Специалист");
    }

    private async Task RemoveTimeSlotAsync(string bookingId)
    {
        var slots = await _context.TimeSlots.Where(item => item.BookingId == bookingId).ToListAsync();
        if (slots.Count > 0)
        {
            _context.TimeSlots.RemoveRange(slots);
        }
    }

    private static bool IsOccupyingStatus(BookingStatus status)
    {
        return status is BookingStatus.Pedding or BookingStatus.Confirmed or BookingStatus.Completed;
    }

    private static bool Overlaps(DateTime leftStart, DateTime leftEnd, DateTime rightStart, DateTime rightEnd)
    {
        return leftStart < rightEnd && leftEnd > rightStart;
    }

    private async Task<eUseControl.Domain.Entities.Specialist.SpecialistData?> ResolveSpecialistAsync(
        ServiceBookingData booking,
        ServiceData? service)
    {
        if (!string.IsNullOrWhiteSpace(booking.SpecialistId))
        {
            var byId = await _context.Specialists.AsNoTracking().FirstOrDefaultAsync(s => s.Id == booking.SpecialistId);
            if (byId is not null) return byId;
        }

        var specialistName = service?.NameOfMaster;
        if (string.IsNullOrWhiteSpace(specialistName))
        {
            specialistName = ParseDescriptionField(booking.BookingDescription, "Специалист");
        }

        return string.IsNullOrWhiteSpace(specialistName)
            ? null
            : await _context.Specialists.AsNoTracking().FirstOrDefaultAsync(s => s.FullName == specialistName);
    }

    private async Task<ServiceData?> ResolveServiceForBookingAsync(ServiceBookingData booking)
    {
        var service = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == booking.BookingId);
        if (service is not null)
        {
            return service;
        }

        var serviceName = ParseServiceName(booking);
        return string.IsNullOrWhiteSpace(serviceName)
            ? null
            : await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.NameOfService == serviceName);
    }

    private static decimal ResolveCompletedPrice(CompletedSpecialistServiceData item, IReadOnlyCollection<ServiceData> services)
    {
        if (item.Price > 0)
        {
            return item.Price;
        }

        var service = services.FirstOrDefault(s => s.Id == item.ServiceId);
        if (service is not null)
        {
            return service.PriceOfService;
        }

        service = services.FirstOrDefault(s => SameText(s.NameOfService, item.ServiceName));
        return service?.PriceOfService ?? item.Price;
    }

    private static string ParseDescriptionField(string description, string label)
    {
        if (string.IsNullOrWhiteSpace(description)) return string.Empty;

        var match = Regex.Match(description, $@"{Regex.Escape(label)}:\s*([^;]+)", RegexOptions.IgnoreCase);
        return match.Success ? match.Groups[1].Value.Trim() : string.Empty;
    }

    private static string ParseServiceName(ServiceBookingData booking)
    {
        var parsed = ParseDescriptionField(booking.BookingDescription, "Услуга");
        return string.IsNullOrWhiteSpace(parsed) ? booking.BookingName : parsed;
    }

    private static bool SameText(string? left, string? right)
    {
        return string.Equals(left?.Trim(), right?.Trim(), StringComparison.OrdinalIgnoreCase);
    }
}
