using Application.Core;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Models.PuzzleModels;

namespace ChessClubBurgas64.Web.Services.Contracts
{
    public interface IPuzzlesService
    {
        Task<PuzzleInputModel?> GetPuzzleAsync(int id);
        Task<PagedList<Puzzle, PuzzleInputModel>?> GetPuzzlesAsync(PagingParams pagingParams);
        Task<PuzzleInputModel> CreatePuzzleAsync(Puzzle puzzle, IFormFile mainImage);
        Task DeletePuzzleAsync(int id);
        Task UpdatePuzzleAsync(int id, Puzzle updatedPuzzle, IFormFile mainImage);
    }
}
