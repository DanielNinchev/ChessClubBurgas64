using Microsoft.AspNetCore.Identity;

namespace Domain;

public class Account : IdentityUser
{
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public bool IsAdmin { get; set; }
    public bool IsConfirmed { get; set; }

    // Navigation properties
    public Guid? StudentId { get; set; }
    public virtual Student? Student { get; set; }
}
