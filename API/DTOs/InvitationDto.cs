namespace API.DTOs;

public class InvitationDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
}