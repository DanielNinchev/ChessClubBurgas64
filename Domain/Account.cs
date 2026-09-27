using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain;

public class Account : IdentityUser
{
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public int Rating { get; set; } = 0;
    public ICollection<Puzzle> CompletedPuzzles { get; set; } = [];

    // Navigation properties — one of these will be populated based on role
    public virtual StudentProfile? StudentProfile { get; set; }
    public virtual TeacherProfile? TeacherProfile { get; set; }

    [NotMapped]
    public string DisplayName => $"{FirstName} {LastName}".Trim();
}
