namespace Domain;

public class Student
{
    public Guid Id { get; set; }
    public DateTime BirthDate { get; set; }
    public string? Address { get; set; }
    public string? School { get; set; }
    public DateTime? DateOfJoiningClub { get; set; }
    public int? ClubRating { get; set; }
    public int? FideRating { get; set; }
    public int? PuzzlePoints { get; set; }
    public static DateTime Date { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Guid AccountId { get; set; }
    public virtual required Account Account { get; set; }
}
