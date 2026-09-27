namespace Domain;

public class Puzzle
{
    public Guid Id { get; set; }
    public int Number { get; set; }
    public required string Description { get; set; }
    public required string Fen { get; set; }
    // Opponent's move (UCI) that leads from Fen to the puzzle position; null when Fen is already the puzzle position
    public string? PreviousMove { get; set; }
    public required string Solution { get; set; }
    public required string Difficulty { get; set; }
    public int Points { get; set; }
    // Lichess puzzle rating; null for hand-made puzzles
    public int? Rating { get; set; }
    public bool WhiteToMove { get; set; }
    public required string Category { get; set; }
}
