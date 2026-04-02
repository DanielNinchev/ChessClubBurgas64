namespace Domain;

public class TeacherProfile
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? Bio { get; set; }
    public string? Specialization { get; set; }

    // Foreign key
    public required string AccountId { get; set; }
    public virtual Account Account { get; set; } = null!;

    // Navigation properties — students assigned to this teacher
    public virtual ICollection<StudentProfile> Students { get; set; } = new HashSet<StudentProfile>();
    public virtual ICollection<Lesson> Lessons { get; set; } = new HashSet<Lesson>();
}