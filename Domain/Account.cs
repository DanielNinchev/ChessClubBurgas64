using Microsoft.AspNetCore.Identity;

namespace Domain;

public class Account : IdentityUser
{
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }

    // Navigation properties — one of these will be populated based on role
    public virtual StudentProfile? StudentProfile { get; set; }
    public virtual TeacherProfile? TeacherProfile { get; set; }
}
