namespace Application.Puzzles.DTOs;

public class CompletePuzzleResultDto
{
    public int Rating { get; set; }
    // False when the puzzle was already solved or (for students) solved out of order
    public bool PointsAwarded { get; set; }
    public bool AlreadyCompleted { get; set; }
    // Lowest-numbered puzzle the user still has to solve; null when all are solved
    public int? NextPuzzleNumber { get; set; }
}
