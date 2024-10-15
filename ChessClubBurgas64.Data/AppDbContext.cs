using ChessClubBurgas64.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessClubBurgas64.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Student> Members { get; set; }
    }
}