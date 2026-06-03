using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EUseControl.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class DropServiceDataSpecialistData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceDataSpecialistData");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceDataSpecialistData",
                columns: table => new
                {
                    ServicesId = table.Column<string>(type: "text", nullable: false),
                    SpecialistDataId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceDataSpecialistData", x => new { x.ServicesId, x.SpecialistDataId });
                    table.ForeignKey(
                        name: "FK_ServiceDataSpecialistData_Services_ServicesId",
                        column: x => x.ServicesId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceDataSpecialistData_Specialists_SpecialistDataId",
                        column: x => x.SpecialistDataId,
                        principalTable: "Specialists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceDataSpecialistData_SpecialistDataId",
                table: "ServiceDataSpecialistData",
                column: "SpecialistDataId");
        }
    }
}
