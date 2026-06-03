using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EUseControl.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddContentItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Role",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS "ContentItems" (
                    "Id" text NOT NULL,
                    "ContentType" character varying(40) NOT NULL,
                    "Title" character varying(180) NOT NULL,
                    "Slug" character varying(180) NOT NULL,
                    "Subtitle" character varying(300) NOT NULL,
                    "Body" text NOT NULL,
                    "ImageUrl" character varying(1000) NOT NULL,
                    "SortOrder" integer NOT NULL,
                    "IsActive" boolean NOT NULL,
                    "CreatedAt" timestamp with time zone NOT NULL,
                    "UpdatedAt" timestamp with time zone NOT NULL,
                    CONSTRAINT "PK_ContentItems" PRIMARY KEY ("Id")
                );
                """);

            migrationBuilder.Sql("""
                CREATE INDEX IF NOT EXISTS "IX_ContentItems_ContentType"
                ON "ContentItems" ("ContentType");
                """);

            migrationBuilder.Sql("""
                CREATE INDEX IF NOT EXISTS "IX_ContentItems_Slug"
                ON "ContentItems" ("Slug");
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContentItems");

            migrationBuilder.AlterColumn<int>(
                name: "Role",
                table: "Users",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 1);
        }
    }
}
