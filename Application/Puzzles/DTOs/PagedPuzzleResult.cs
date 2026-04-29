namespace Application.Puzzles.DTOs
{
    public class PagedPuzzleResult
    {
        public List<PuzzleDto> Items { get; set; } = [];
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public List<string> Categories { get; set; } = [];
    }
}