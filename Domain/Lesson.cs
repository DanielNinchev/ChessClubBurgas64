namespace Domain
{
    public class Lesson
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Topic { get; set; }
        public DateTime StartingTime { get; set; }
        public string? Notes { get; set; }

        // Teacher who conducts the lesson
        public required string TeacherId { get; set; }
        public virtual TeacherProfile Teacher { get; set; } = null!;

        // Navigation properties
        public virtual ICollection<LessonStudent> LessonStudents { get; set; } = new HashSet<LessonStudent>();
    }
}
