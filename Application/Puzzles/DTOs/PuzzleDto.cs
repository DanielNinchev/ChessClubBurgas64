namespace Application.Puzzles.DTOs;

public class PuzzleDto
{
    public Guid Id { get; set; }
    public int Number { get; set; }
    public required string Description { get; set; }
    public required string Fen { get; set; }
    public string? PreviousMove { get; set; }
    public required string Solution { get; set; }
    public required string Difficulty { get; set; }
    public int Points { get; set; }
    public int? Rating { get; set; }
    public bool WhiteToMove { get; set; }
    public required string Category { get; set; }
    public bool IsCompleted { get; set; }
}