using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EUseControl.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceImagesCrud : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Bookings_BookingId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkSchedules_Specialists_SpecialistDataId",
                table: "WorkSchedules");

            migrationBuilder.DropIndex(
                name: "IX_WorkSchedules_SpecialistDataId",
                table: "WorkSchedules");

            migrationBuilder.DropColumn(
                name: "SpecialistDataId",
                table: "WorkSchedules");

            migrationBuilder.AlterColumn<string>(
                name: "BookingId",
                table: "Reviews",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "ServiceImages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ServiceName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ServiceId = table.Column<string>(type: "text", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceImages_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkSchedules_SpecialistId",
                table: "WorkSchedules",
                column: "SpecialistId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceImages_ServiceId",
                table: "ServiceImages",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Bookings_BookingId",
                table: "Reviews",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkSchedules_Specialists_SpecialistId",
                table: "WorkSchedules",
                column: "SpecialistId",
                principalTable: "Specialists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Bookings_BookingId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkSchedules_Specialists_SpecialistId",
                table: "WorkSchedules");

            migrationBuilder.DropTable(
                name: "ServiceImages");

            migrationBuilder.DropIndex(
                name: "IX_WorkSchedules_SpecialistId",
                table: "WorkSchedules");

            migrationBuilder.AddColumn<string>(
                name: "SpecialistDataId",
                table: "WorkSchedules",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "BookingId",
                table: "Reviews",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkSchedules_SpecialistDataId",
                table: "WorkSchedules",
                column: "SpecialistDataId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Bookings_BookingId",
                table: "Reviews",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkSchedules_Specialists_SpecialistDataId",
                table: "WorkSchedules",
                column: "SpecialistDataId",
                principalTable: "Specialists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
