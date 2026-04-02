namespace Application.Puzzles.DTOs
{
    public class PuzzleDto
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Fen { get; set; }
        public required string Solution { get; set; }
        public required string Difficulty { get; set; }
        public required string Date { get; set; }
    }
}