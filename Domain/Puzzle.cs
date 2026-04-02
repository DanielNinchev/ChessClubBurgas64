using System.Text.Json.Serialization;

namespace Domain
{
    public class Puzzle
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Fen { get; set; }
        public required string Solution { get; set; }
        public required string Difficulty { get; set; } // Лесна, Средна, Трудна
        public DateTime Date { get; set; }
    }
}
