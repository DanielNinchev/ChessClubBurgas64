#nullable disable
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Data.Models.Enums;

namespace ChessClubBurgas64.Web.Models.PuzzleModels
{
    public class PuzzleInputModel
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public string Description { get; set; }
        public string Solution { get; set; }
        public int Points { get; set; }
        public PuzzleDifficulty Difficulty { get; set; }
        public string ImageUrl { get; set; }
        public Image Image { get; set; }
    }
}
