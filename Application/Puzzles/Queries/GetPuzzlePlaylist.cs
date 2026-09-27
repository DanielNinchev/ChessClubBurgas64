using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Queries;

public class GetPuzzlePlaylist
{
    public class Query : IRequest<Result<PuzzlePlaylistDto>>
    {
        public int Around { get; set; }
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PuzzlePlaylistDto>>
    {
        private const int Neighbours = 2;

        public async Task<Result<PuzzlePlaylistDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            // Numbers can have gaps (deleted puzzles), so pick the first puzzle at or after the requested number,
            // falling back to the last one when the request is past the end
            var currentNumber = await context.Puzzles
                .Where(p => p.Number >= request.Around)
                .MinAsync(p => (int?)p.Number, cancellationToken)
                ?? await context.Puzzles.MaxAsync(p => (int?)p.Number, cancellationToken);

            if (currentNumber == null)
                return Result<PuzzlePlaylistDto>.Success(new PuzzlePlaylistDto());

            var before = await context.Puzzles
                .Where(p => p.Number < currentNumber)
                .OrderByDescending(p => p.Number)
                .Take(Neighbours)
                .ToListAsync(cancellationToken);

            var currentAndAfter = await context.Puzzles
                .Where(p => p.Number >= currentNumber)
                .OrderBy(p => p.Number)
                .Take(Neighbours + 1)
                .ToListAsync(cancellationToken);

            var completedIds = (await context.Users
                .Where(u => u.Id == request.UserId)
                .SelectMany(u => u.CompletedPuzzles.Select(cp => cp.Id))
                .ToListAsync(cancellationToken))
                .ToHashSet();

            var items = before.AsEnumerable().Reverse().Concat(currentAndAfter)
                .Select(p => new PuzzleDto
                {
                    Id = p.Id,
                    Number = p.Number,
                    Description = p.Description,
                    Fen = p.Fen,
                    PreviousMove = p.PreviousMove,
                    Solution = p.Solution,
                    Difficulty = p.Difficulty,
                    Points = p.Points,
                    Rating = p.Rating,
                    WhiteToMove = p.WhiteToMove,
                    Category = p.Category,
                    IsCompleted = completedIds.Contains(p.Id),
                })
                .ToList();

            return Result<PuzzlePlaylistDto>.Success(new PuzzlePlaylistDto
            {
                Items = items,
                CurrentNumber = currentNumber,
            });
        }
    }
}
