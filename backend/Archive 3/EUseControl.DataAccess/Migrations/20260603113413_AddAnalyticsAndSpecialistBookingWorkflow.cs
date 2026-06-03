using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EUseControl.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAnalyticsAndSpecialistBookingWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_UserDataId",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "UserDataId",
                table: "Bookings",
                newName: "ClientUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Bookings_UserDataId",
                table: "Bookings",
                newName: "IX_Bookings_ClientUserId");

            migrationBuilder.AddColumn<string>(
                name: "SpecialistId",
                table: "Bookings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedOn",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SpecialistConfirmedOn",
                table: "Bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Bookings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Device",
                table: "LoginLogs",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "LogoutDataTime",
                table: "LoginLogs",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PagePath",
                table: "LoginLogs",
                type: "character varying(240)",
                maxLength: 240,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "LoginLogs",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SessionDurationSeconds",
                table: "LoginLogs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "LoginLogs",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VisitorId",
                table: "LoginLogs",
                type: "character varying(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CompletedSpecialistServices",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    BookingId = table.Column<string>(type: "text", nullable: false),
                    ServiceId = table.Column<string>(type: "text", nullable: false),
                    ServiceName = table.Column<string>(type: "text", nullable: false),
                    SpecialistId = table.Column<string>(type: "text", nullable: false),
                    SpecialistName = table.Column<string>(type: "text", nullable: false),
                    ClientName = table.Column<string>(type: "text", nullable: false),
                    ClientPhone = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    BookingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedSpecialistServices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_SpecialistId",
                table: "Bookings",
                column: "SpecialistId");

            migrationBuilder.CreateIndex(
                name: "IX_CompletedSpecialistServices_BookingId",
                table: "CompletedSpecialistServices",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompletedSpecialistServices_CompletedOn",
                table: "CompletedSpecialistServices",
                column: "CompletedOn");

            migrationBuilder.CreateIndex(
                name: "IX_CompletedSpecialistServices_SpecialistId",
                table: "CompletedSpecialistServices",
                column: "SpecialistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_ClientUserId",
                table: "Bookings",
                column: "ClientUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_ClientUserId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "CompletedSpecialistServices");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_SpecialistId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SpecialistId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CompletedOn",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SpecialistConfirmedOn",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Device",
                table: "LoginLogs");

            migrationBuilder.DropColumn(
                name: "LogoutDataTime",
                table: "LoginLogs");

            migrationBuilder.DropColumn(
                name: "PagePath",
                table: "LoginLogs");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "LoginLogs");

            migrationBuilder.DropColumn(
                name: "SessionDurationSeconds",
                table: "LoginLogs");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "LoginLogs");

            migrationBuilder.DropColumn(
                name: "VisitorId",
                table: "LoginLogs");

            migrationBuilder.RenameColumn(
                name: "ClientUserId",
                table: "Bookings",
                newName: "UserDataId");

            migrationBuilder.RenameIndex(
                name: "IX_Bookings_ClientUserId",
                table: "Bookings",
                newName: "IX_Bookings_UserDataId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_UserDataId",
                table: "Bookings",
                column: "UserDataId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
