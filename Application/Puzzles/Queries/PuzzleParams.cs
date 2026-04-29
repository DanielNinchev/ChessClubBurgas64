namespace Application.Puzzles.Queries
{
    public class PuzzleParams
    {
        public string? Cursor { get; set; }
        public int PageSize { get; set; } = 9;
        public int PageNumber { get; set; } = 1;
        public string? Difficulty { get; set; }
        public string? Category { get; set; }
        public string? Keyword { get; set; }
        public string? Sort { get; set; } = "number";
    }
}