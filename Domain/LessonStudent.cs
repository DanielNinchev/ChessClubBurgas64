namespace Domain;

public class LessonStudent
{
    public required Guid LessonId { get; set; }
    public virtual Lesson Lesson { get; set; } = null!;

    public required Guid StudentId { get; set; }
    public virtual StudentProfile Student { get; set; } = null!;

    // Attendance tracking
    public bool IsPresent { get; set; }
    public string? Notes { get; set; }
}