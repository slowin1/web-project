using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EUseControl.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class LinkSpecialistsToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Specialists",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Specialists_UserId",
                table: "Specialists",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Specialists_Users_UserId",
                table: "Specialists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Specialists_Users_UserId",
                table: "Specialists");

            migrationBuilder.DropIndex(
                name: "IX_Specialists_UserId",
                table: "Specialists");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Specialists");
        }
    }
}
