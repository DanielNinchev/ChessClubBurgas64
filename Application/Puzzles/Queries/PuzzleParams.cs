namespace Application.Puzzles.Queries
{
    public class PuzzleParams
    {
        public string? Cursor { get; set; }
        public int PageSize { get; set; } = 6;
        public string? Difficulty { get; set; }
        public DateTime? StartDate { get; set; }
    }
}