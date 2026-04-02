namespace Domain;

public class Invitation
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Email { get; set; }
    public required string Token { get; set; }
    public required string Role { get; set; } // "Student" or "Teacher"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }

    // Optional: pre-assign to a teacher group
    public string? TeacherId { get; set; }
    public virtual TeacherProfile? Teacher { get; set; }

    // Who created the invitation
    public required string CreatedByAccountId { get; set; }
    public virtual Account CreatedByAccount { get; set; } = null!;
}