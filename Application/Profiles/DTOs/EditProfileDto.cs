namespace Application.Profiles.DTOs;

public class EditProfileDto
{
    // Common fields
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }

    // Student-specific
    public DateTime? BirthDate { get; set; }
    public string? Address { get; set; }
    public string? School { get; set; }

    // Teacher-specific
    public string? Bio { get; set; }
    public string? Specialization { get; set; }
}