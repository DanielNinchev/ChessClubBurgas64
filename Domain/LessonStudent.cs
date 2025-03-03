namespace Domain
{
    public class LessonStudent
    {
        public required string LessonId { get; set; }
        public required virtual Lesson Lesson { get; set; }
        public required string StudentId { get; set; }
        public required virtual Student Student { get; set; }
    }
}
