using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Queries
{
    public class GetPuzzleList
    {
        public class Query : IRequest<Result<PagedList<PuzzleDto, string?>>>
        {
            public required PuzzleParams Params { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PagedList<PuzzleDto, string?>>>
        {
            public async Task<Result<PagedList<PuzzleDto, string?>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Puzzles.OrderByDescending(p => p.Date).AsQueryable();

                if (!string.IsNullOrEmpty(request.Params.Difficulty))
                {
                    query = query.Where(p => p.Difficulty == request.Params.Difficulty);
                }

                if (request.Params.StartDate != null)
                {
                    query = query.Where(p => p.Date >= request.Params.StartDate);
                }

                if (!string.IsNullOrEmpty(request.Params.Cursor))
                {
                    var cursorDate = await context.Puzzles
                        .Where(p => p.Id == Guid.Parse(request.Params.Cursor))
                        .Select(p => p.Date)
                        .FirstOrDefaultAsync(cancellationToken);

                    query = query.Where(p => p.Date < cursorDate);
                }

                var puzzles = await query
                    .Take(request.Params.PageSize + 1)
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
                    .ToListAsync(cancellationToken);

                string? nextCursor = null;
                if (puzzles.Count > request.Params.PageSize)
                {
                    nextCursor = puzzles[request.Params.PageSize].Id;
                    puzzles = puzzles.Take(request.Params.PageSize).ToList();
                }

                return Result<PagedList<PuzzleDto, string?>>.Success(
                    new PagedList<PuzzleDto, string?>
                    {
                        Items = puzzles,
                        NextCursor = nextCursor
                    });
            }
        }
    }
}