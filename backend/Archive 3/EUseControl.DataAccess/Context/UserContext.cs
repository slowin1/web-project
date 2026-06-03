using Microsoft.EntityFrameworkCore;
using eUseControl.Domain.Entities.content;
using eUseControl.Domain.Entities.User;
using eUseControl.Domain.Entities.Specialist;
using eUseControl.Domain.Entities.services;
using eUseControl.Domain.Enums;

namespace EUseControl.DataAccess.Context;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options) : base(options) { }

    public DbSet<UserData> Users { get; set; }
    public DbSet<ULoginData> LoginLogs { get; set; }
    public DbSet<SpecialistData> Specialists { get; set; }
    public DbSet<SpecialistWorkSchedule> WorkSchedules { get; set; }
    public DbSet<SpecialistReview> Reviews { get; set; }
    public DbSet<ServiceData> Services { get; set; }
    public DbSet<ServiceCategoryData> ServiceCategories { get; set; }
    public DbSet<ServiceImgData> ServiceImages { get; set; }
    public DbSet<ServiceTimeSlot> TimeSlots { get; set; }
    public DbSet<ServiceBookingData> Bookings { get; set; }
    public DbSet<CompletedSpecialistServiceData> CompletedSpecialistServices { get; set; }
    public DbSet<ContentItemData> ContentItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserData>()
            .Property(u => u.Role)
            .HasDefaultValue(UserRole.Client);

        modelBuilder.Entity<ContentItemData>()
            .HasIndex(item => item.ContentType);

        modelBuilder.Entity<ContentItemData>()
            .HasIndex(item => item.Slug);

        // ServiceData -> Category
        modelBuilder.Entity<ServiceData>()
            .HasOne(s => s.Category)
            .WithMany()
            .HasForeignKey(s => s.CategoryId);

        // ServiceTimeSlot -> ServiceBookingData
        modelBuilder.Entity<ServiceTimeSlot>()
            .HasOne(t => t.Booking)
            .WithMany()
            .HasForeignKey(t => t.BookingId)
            .IsRequired(false);

        modelBuilder.Entity<ServiceBookingData>()
            .HasIndex(b => b.SpecialistId);

        modelBuilder.Entity<ServiceBookingData>()
            .HasIndex(b => b.ClientUserId);

        modelBuilder.Entity<ServiceBookingData>()
            .HasOne<UserData>()
            .WithMany(user => user.ServiceBookingData)
            .HasForeignKey(booking => booking.ClientUserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<CompletedSpecialistServiceData>()
            .ToTable("CompletedSpecialistServices");

        modelBuilder.Entity<CompletedSpecialistServiceData>()
            .HasIndex(item => item.CompletedOn);

        modelBuilder.Entity<CompletedSpecialistServiceData>()
            .HasIndex(item => item.SpecialistId);

        modelBuilder.Entity<CompletedSpecialistServiceData>()
            .HasIndex(item => item.BookingId)
            .IsUnique();

        // ServiceImgData -> ServiceData
        modelBuilder.Entity<ServiceImgData>()
            .HasOne(i => i.Service)
            .WithMany()
            .HasForeignKey(i => i.ServiceId);

        // SpecialistWorkSchedule -> SpecialistData
        modelBuilder.Entity<SpecialistWorkSchedule>()
            .HasOne(s => s.SpecialistData)
            .WithMany()
            .HasForeignKey(s => s.SpecialistId);

        // SpecialistReview -> UserData
        modelBuilder.Entity<SpecialistReview>()
            .HasOne(r => r.Client)
            .WithMany()
            .HasForeignKey(r => r.ClientId);

        // SpecialistReview -> ServiceBookingData
        modelBuilder.Entity<SpecialistReview>()
            .HasOne(r => r.Booking)
            .WithMany()
            .HasForeignKey(r => r.BookingId)
            .IsRequired(false);

        // SpecialistData -> UserData
        modelBuilder.Entity<SpecialistData>()
            .HasOne(s => s.User)
            .WithOne()
            .HasForeignKey<SpecialistData>(s => s.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<SpecialistData>()
            .HasIndex(s => s.UserId)
            .IsUnique();

        // SpecialistData -> TimeSlots
        modelBuilder.Entity<SpecialistData>()
            .HasMany(s => s.TimeSlots)
            .WithOne()
            .HasForeignKey(t => t.SpecialistId);
    }
}
