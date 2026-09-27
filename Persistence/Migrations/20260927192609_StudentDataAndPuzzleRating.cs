using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class StudentDataAndPuzzleRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "BirthDate",
                table: "StudentProfiles",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            // Students without a birth date were stored with the non-nullable default (0001-01-01)
            migrationBuilder.Sql("""UPDATE "StudentProfiles" SET "BirthDate" = NULL WHERE "BirthDate" < '1900-01-01';""");

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "Puzzles",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Puzzles");

            migrationBuilder.AlterColumn<DateTime>(
                name: "BirthDate",
                table: "StudentProfiles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
