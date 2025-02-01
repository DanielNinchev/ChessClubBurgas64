using Application.Core;
using AutoMapper;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Infrastructure.Contracts;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Models.PuzzleModels;
using ChessClubBurgas64.Web.Services.Contracts;
using Microsoft.EntityFrameworkCore;

namespace ChessClubBurgas64.Web.Services
{
    public class PuzzlesService(ILogger<AnnouncementsService> logger, AppDbContext dbContext, IMapper mapper, IImageAccessor imageAccessor) : IPuzzlesService
    {
        private readonly ILogger<AnnouncementsService> _logger = logger;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly IMapper _mapper = mapper;
        private readonly IImageAccessor _imageAccessor = imageAccessor;

        public async Task<PuzzleInputModel> CreatePuzzleAsync(Puzzle puzzle, IFormFile image)
        {
            var imageUploadResult = await _imageAccessor.AddImageAsync(image);

            puzzle.Image = _mapper.Map<Image>(imageUploadResult);
            puzzle.Image.IsMain = true;

            _dbContext.Images.Add(puzzle.Image);
            _dbContext.Puzzles.Add(puzzle);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<PuzzleInputModel>(puzzle);
        }

        public async Task DeletePuzzleAsync(int id)
        {
            var puzzle = await _dbContext.Puzzles.SingleAsync(a => a.Id == id);
            await _imageAccessor.DeleteImageAsync(puzzle.ImageId);
            _dbContext.Images.Remove(puzzle.Image);
            _dbContext.Puzzles.Remove(puzzle);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<PuzzleInputModel?> GetPuzzleAsync(int id)
        {
            if (_dbContext.Puzzles == null)
            {
                return null;
            }

            var puzzle = await _dbContext.Puzzles.SingleOrDefaultAsync(x => x.Id == id);

            return _mapper.Map<PuzzleInputModel>(puzzle);
        }

        public async Task<PagedList<Puzzle, PuzzleInputModel>?> GetPuzzlesAsync(PagingParams pagingParams)
        {
            if (_dbContext.Puzzles == null)
            {
                return null;
            }

            var query = _dbContext.Puzzles
                .OrderBy(p => p.Number)
                .AsQueryable();

            return await PagedList<Puzzle, PuzzleInputModel>.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize, _mapper);
        }

        public async Task UpdatePuzzleAsync(int id, Puzzle updatedPuzzle, IFormFile image)
        {
            var currentPuzzle = await _dbContext.Puzzles.SingleAsync(a => a.Id == id);

            currentPuzzle.Number = updatedPuzzle.Number;
            currentPuzzle.Description = updatedPuzzle.Description;
            currentPuzzle.Solution = updatedPuzzle.Solution;
            currentPuzzle.Points = updatedPuzzle.Points;
            currentPuzzle.Difficulty = updatedPuzzle.Difficulty;

            await _imageAccessor.DeleteImageAsync(currentPuzzle.ImageId);
            _dbContext.Images.Remove(currentPuzzle.Image);
            var imageUploadResult = await _imageAccessor.AddImageAsync(image);

            currentPuzzle.Image = _mapper.Map<Image>(imageUploadResult);
            currentPuzzle.Image.IsMain = true;

            _dbContext.Images.Add(currentPuzzle.Image);
            _dbContext.Puzzles.Add(currentPuzzle);
            _dbContext.Entry(currentPuzzle).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }
    }
}
