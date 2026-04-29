namespace Application.Puzzles.DTOs
{
    public class EditPuzzleDto
    {
        public required string Id { get; set; }
        public required int Number { get; set; }
        public required string Description { get; set; }
        public required string Fen { get; set; }
        public required string Solution { get; set; }
        public required string Difficulty { get; set; }
        public DateTime Date { get; set; }
    }
}