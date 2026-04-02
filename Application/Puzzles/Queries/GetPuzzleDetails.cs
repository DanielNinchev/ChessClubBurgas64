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
            public required string Id { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PuzzleDto>>
        {
            public async Task<Result<PuzzleDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var puzzle = await context.Puzzles
                    .Where(p => p.Id == Guid.Parse(request.Id))
                    .Select(p => new PuzzleDto
                    {
                        Id = p.Id.ToString(),
                        Title = p.Title,
                        Description = p.Description,
                        Fen = p.Fen,
                        Solution = p.Solution,
                        Difficulty = p.Difficulty,
                        Date = p.Date.ToString("o"),
                    })
                    .FirstOrDefaultAsync(cancellationToken);

                if (puzzle == null) return Result<PuzzleDto>.Failure("Задачата не е намерена", 404);

                return Result<PuzzleDto>.Success(puzzle);
            }
        }
    }
}