using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessClubBurgas64.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Announcements_AnnouncementId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Info",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "MainPhotoUrl",
                table: "Announcements");

            migrationBuilder.AlterColumn<Guid>(
                name: "AnnouncementId",
                table: "Images",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<bool>(
                name: "IsMain",
                table: "Images",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Announcements_AnnouncementId",
                table: "Images",
                column: "AnnouncementId",
                principalTable: "Announcements",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Announcements_AnnouncementId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "IsMain",
                table: "Images");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Students",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<Guid>(
                name: "AnnouncementId",
                table: "Images",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info",
                table: "Images",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Announcements",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "MainPhotoUrl",
                table: "Announcements",
                type: "text",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Announcements_AnnouncementId",
                table: "Images",
                column: "AnnouncementId",
                principalTable: "Announcements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
