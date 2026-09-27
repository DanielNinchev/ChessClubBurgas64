namespace Application.Puzzles.DTOs;

public class PuzzlePlaylistDto
{
    // Up to 2 puzzles before the current one, the current one, and up to 2 after it - in number order
    public List<PuzzleDto> Items { get; set; } = [];
    public int? CurrentNumber { get; set; }
}
