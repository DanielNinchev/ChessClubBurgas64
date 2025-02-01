using ChessClubBurgas64.Common;
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models.Enums
{
    public enum PuzzleDifficulty
    {
        [Display(Name = GlobalConstants.BeginnerPuzzle)]
        Начинаеща = 1, // Beginner

        [Display(Name = GlobalConstants.EasyPuzzle)]
        Ниска = 2, // Low

        [Display(Name = GlobalConstants.AveragePuzzle)]
        Средна = 3, // Average

        [Display(Name = GlobalConstants.HardPuzzle)]
        Висока = 4, // High

        [Display(Name = GlobalConstants.ExtremePuzzle)]
        Майсторска = 5, // Extreme (Master)
    }
}
