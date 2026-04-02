namespace API.DTOs;

public class CreateInvitationDto
{
    public required string Email { get; set; }
    public required string Role { get; set; } // "Student" or "Teacher"
    public string? TeacherId { get; set; } // Optional: pre-assign student to teacher
}