using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<Account>(options)
{
    public required DbSet<Account> Accounts { get; set; }
    public required DbSet<Announcement> Announcements { get; set; }
    public required DbSet<Lesson> Lessons { get; set; }
    public required DbSet<LessonStudent> LessonStudents { get; set; }
    public required DbSet<Photo> Photos { get; set; }
    public required DbSet<Puzzle> Puzzles { get; set; }
    public required DbSet<Student> Students { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<LessonStudent>().HasNoKey();
        builder.Entity<Puzzle>()
               .HasOne(p => p.Photo)
               .WithOne(ph => ph.Puzzle)
               .HasForeignKey<Puzzle>(i => i.PhotoId);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
        );

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}
