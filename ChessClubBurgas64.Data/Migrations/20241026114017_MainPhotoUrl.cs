using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessClubBurgas64.Data.Migrations
{
    /// <inheritdoc />
    public partial class MainPhotoUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMain",
                table: "Images");

            migrationBuilder.AddColumn<string>(
                name: "MainPhotoUrl",
                table: "Announcements",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MainPhotoUrl",
                table: "Announcements");

            migrationBuilder.AddColumn<bool>(
                name: "IsMain",
                table: "Images",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
