namespace Domain;

public class Student
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime BirthDate { get; set; }
    public string? Address { get; set; }
    public string? School { get; set; }
    public DateTime? DateOfJoiningClub { get; set; }
    public int? ClubRating { get; set; }
    public int? FideRating { get; set; }
    public int? PuzzlePoints { get; set; }
    public static DateTime Date { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public required string AccountId { get; set; }
    public virtual required Account Account { get; set; }
}
