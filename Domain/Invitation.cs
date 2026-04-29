namespace Domain;

public class Invitation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public required string Role { get; set; } // "Student" or "Teacher"
    public string? TeacherId { get; set; }
    public required string Token { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
}