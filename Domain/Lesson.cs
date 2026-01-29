namespace Domain
{
    public class Lesson
    {
        public required string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Topic { get; set; }
        public DateTime StartingTime { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual ICollection<Student> Students { get; set; } = new HashSet<Student>();
    }
}
