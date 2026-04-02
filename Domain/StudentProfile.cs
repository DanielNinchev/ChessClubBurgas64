namespace Domain;

public class StudentProfile
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime BirthDate { get; set; }
    public string? Address { get; set; }
    public string? School { get; set; }
    public DateTime? DateOfJoiningClub { get; set; }
    public int? ClubRating { get; set; }
    public int? FideRating { get; set; }
    public int? PuzzlePoints { get; set; }

    // Foreign key
    public required string AccountId { get; set; }
    public virtual Account Account { get; set; } = null!;

    // Navigation properties
    public virtual ICollection<LessonStudent> LessonStudents { get; set; } = new HashSet<LessonStudent>();
    public virtual TeacherProfile? Teacher { get; set; }
    public string? TeacherId { get; set; }
}