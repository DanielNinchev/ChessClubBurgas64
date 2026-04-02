namespace Application.Puzzles.Commands
{
    public class CreatePuzzleDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Fen { get; set; }
        public required string Solution { get; set; }
        public required string Difficulty { get; set; }
        public DateTime Date { get; set; }
    }
}