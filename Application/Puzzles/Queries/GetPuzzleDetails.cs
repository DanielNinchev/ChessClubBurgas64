using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Queries
{
    public class GetPuzzleDetails
    {
        public class Query : IRequest<Result<PuzzleDto>>
        {
            public Guid Id { get; set; }
            public string? UserId { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PuzzleDto>>
        {
            public async Task<Result<PuzzleDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var puzzle = await context.Puzzles
                    .Where(p => p.Id == request.Id)
                    .Select(p => new PuzzleDto
                    {
                        Id = p.Id,
                        Number = p.Number,
                        Description = p.Description,
                        Fen = p.Fen,
                        PreviousMove = p.PreviousMove,
                        Solution = p.Solution,
                        Difficulty = p.Difficulty,
                        Category = p.Category,
                        Points = p.Points,
                        Rating = p.Rating,
                        WhiteToMove = p.WhiteToMove,
                        IsCompleted = request.UserId != null && context.Users
                            .Any(u => u.Id == request.UserId && u.CompletedPuzzles.Any(cp => cp.Id == p.Id))
                    })
                    .FirstOrDefaultAsync(cancellationToken);

                if (puzzle == null) return Result<PuzzleDto>.Failure("Задачата не е намерена", 404);

                return Result<PuzzleDto>.Success(puzzle);
            }
        }
    }
}