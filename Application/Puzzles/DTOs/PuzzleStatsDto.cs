namespace Application.Puzzles.DTOs;

public class PuzzleStatsDto
{
    public int TotalPuzzles { get; set; }
    public int CompletedCount { get; set; }
    public int PointsEarned { get; set; }
    public int? AverageRating { get; set; }
    public int? HighestRating { get; set; }
    // Lowest-numbered unsolved puzzle; null when everything is solved
    public int? NextPuzzleNumber { get; set; }
    public int? LastPuzzleNumber { get; set; }
    public List<PuzzleStatGroupDto> ByDifficulty { get; set; } = [];
    public List<PuzzleStatGroupDto> ByRating { get; set; } = [];
    public List<PuzzleStatGroupDto> ByCategory { get; set; } = [];
}

public class PuzzleStatGroupDto
{
    public required string Name { get; set; }
    public int Completed { get; set; }
    public int Total { get; set; }
}
