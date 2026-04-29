using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<Account>(options)
{
    public required DbSet<Account> Accounts { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Puzzle> Puzzles { get; set; }
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<TeacherProfile> TeacherProfiles { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonStudent> LessonStudents { get; set; }
    public DbSet<Invitation> Invitations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Announcement>(entity =>
        {
            entity.HasMany(a => a.Photos)
                .WithOne(p => p.Announcement)
                .HasForeignKey(p => p.AnnouncementId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Account>(entity =>
        {
            entity.HasOne(a => a.StudentProfile)
                .WithOne(s => s.Account)
                .HasForeignKey<StudentProfile>(s => s.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.TeacherProfile)
                .WithOne(t => t.Account)
                .HasForeignKey<TeacherProfile>(t => t.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(a => a.CompletedPuzzles)
                .WithMany()
                .UsingEntity(j => j.ToTable("AccountCompletedPuzzles"));
        });

        builder.Entity<StudentProfile>(entity =>
        {
            entity.HasOne(s => s.Teacher)
                .WithMany(t => t.Students)
                .HasForeignKey(s => s.TeacherId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Lesson>(entity =>
        {
            entity.HasOne(l => l.Teacher)
                .WithMany(t => t.Lessons)
                .HasForeignKey(l => l.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<LessonStudent>(entity =>
        {
            entity.HasKey(ls => new { ls.LessonId, ls.StudentId });

            entity.HasOne(ls => ls.Lesson)
                .WithMany(l => l.LessonStudents)
                .HasForeignKey(ls => ls.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ls => ls.Student)
                .WithMany(s => s.LessonStudents)
                .HasForeignKey(ls => ls.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Store all DateTime as UTC
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(
                        new ValueConverter<DateTime, DateTime>(
                            v => v.ToUniversalTime(),
                            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                        ));
                }
            }
        }
    }
}
