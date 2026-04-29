using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Queries;

public class GetPuzzleList
{
    public class Query : IRequest<Result<PagedPuzzleResult>>
    {
        public required PuzzleParams Params { get; set; }
        public string? UserId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PagedPuzzleResult>>
    {
        public async Task<Result<PagedPuzzleResult>> Handle(Query request, CancellationToken cancellationToken)
        {
            var p = request.Params;
            var query = context.Puzzles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(p.Difficulty))
                query = query.Where(x => x.Difficulty == p.Difficulty);

            if (!string.IsNullOrWhiteSpace(p.Category))
                query = query.Where(x => x.Category == p.Category);

            if (!string.IsNullOrWhiteSpace(p.Keyword))
            {
                var kw = p.Keyword.ToLower();
                query = query.Where(x =>
                    x.Description.ToLower().Contains(kw) ||
                    x.Category.ToLower().Contains(kw));
            }

            query = p.Sort switch
            {
                "points-asc"  => query.OrderBy(x => x.Points),
                "points-desc" => query.OrderByDescending(x => x.Points),
                "difficulty"  => query.OrderBy(x => x.Difficulty),
                "category"    => query.OrderBy(x => x.Category),
                _             => query.OrderBy(x => x.Number),
            };

            var totalCount = await query.CountAsync(cancellationToken);
            var totalPages = (int)Math.Ceiling(totalCount / (double)p.PageSize);

            // Get completed puzzle IDs for this user (empty set if not logged in)
            var completedIds = new HashSet<Guid>();
            if (!string.IsNullOrWhiteSpace(request.UserId))
            {
                completedIds = (await context.Users
                    .Where(u => u.Id == request.UserId)
                    .SelectMany(u => u.CompletedPuzzles.Select(cp => cp.Id))
                    .ToListAsync(cancellationToken))
                    .ToHashSet();
            }

            var items = await query
                .Skip((p.PageNumber - 1) * p.PageSize)
                .Take(p.PageSize)
                .Select(x => new PuzzleDto
                {
                    Id          = x.Id,
                    Number      = x.Number,
                    Description = x.Description,
                    Fen         = x.Fen,
                    Solution    = x.Solution,
                    Difficulty  = x.Difficulty,
                    Points      = x.Points,
                    WhiteToMove = x.WhiteToMove,
                    Category    = x.Category,
                })
                .ToListAsync(cancellationToken);

            // Mark completed after the DB query (HashSet lookup is O(1))
            foreach (var item in items)
                item.IsCompleted = completedIds.Contains(item.Id);

            var categories = await context.Puzzles
                .Select(x => x.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync(cancellationToken);

            return Result<PagedPuzzleResult>.Success(new PagedPuzzleResult
            {
                Items      = items,
                TotalCount = totalCount,
                PageNumber = p.PageNumber,
                PageSize   = p.PageSize,
                TotalPages = totalPages,
                Categories = categories,
            });
        }
    }
}