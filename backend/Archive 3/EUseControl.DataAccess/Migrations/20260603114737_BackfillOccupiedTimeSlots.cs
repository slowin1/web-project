using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EUseControl.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class BackfillOccupiedTimeSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO "TimeSlots" (
                    "Id",
                    "StartTime",
                    "EndTime",
                    "IsAvailable",
                    "SpecialistId",
                    "SpecialistName",
                    "BookingId"
                )
                SELECT
                    'booking-slot-' || b."Id",
                    b."BookingTime",
                    b."BookingTime" + make_interval(mins => GREATEST(COALESCE(s."DurationOfService", 30), 30)),
                    false,
                    b."SpecialistId",
                    COALESCE(sp."FullName", s."NameOfMaster", ''),
                    b."Id"
                FROM "Bookings" b
                LEFT JOIN "Services" s ON s."Id" = b."BookingId"
                LEFT JOIN "Specialists" sp ON sp."Id" = b."SpecialistId"
                WHERE b."SpecialistId" IS NOT NULL
                  AND b."Status" IN (0, 1, 3)
                  AND NOT EXISTS (
                      SELECT 1
                      FROM "TimeSlots" ts
                      WHERE ts."BookingId" = b."Id"
                  );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "TimeSlots"
                WHERE "Id" LIKE 'booking-slot-%';
                """);
        }
    }
}
