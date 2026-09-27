using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Queries;

public class GetPuzzleStats
{
    public class Query : IRequest<Result<PuzzleStatsDto>>
    {
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PuzzleStatsDto>>
    {
        private static readonly string[] _difficultyOrder = ["Лесна", "Средна", "Трудна"];

        private static readonly (int Max, string Name)[] _ratingBands =
        [
            (999, "под 1000"),
            (1399, "1000 – 1399"),
            (1799, "1400 – 1799"),
            (2199, "1800 – 2199"),
            (int.MaxValue, "2200+"),
        ];

        private static string RatingBand(int? rating) => rating == null
            ? "Без рейтинг"
            : _ratingBands.First(b => rating <= b.Max).Name;

        public async Task<Result<PuzzleStatsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var puzzles = await context.Puzzles
                .Select(p => new { p.Id, p.Number, p.Category, p.Difficulty, p.Rating, p.Points })
                .ToListAsync(cancellationToken);

            var completedIds = (await context.Users
                .Where(u => u.Id == request.UserId)
                .SelectMany(u => u.CompletedPuzzles.Select(cp => cp.Id))
                .ToListAsync(cancellationToken))
                .ToHashSet();

            var completed = puzzles.Where(p => completedIds.Contains(p.Id)).ToList();
            var completedRatings = completed.Where(p => p.Rating != null).Select(p => p.Rating!.Value).ToList();

            var stats = new PuzzleStatsDto
            {
                TotalPuzzles = puzzles.Count,
                CompletedCount = completed.Count,
                PointsEarned = completed.Sum(p => p.Points),
                AverageRating = completedRatings.Count > 0 ? (int)Math.Round(completedRatings.Average()) : null,
                HighestRating = completedRatings.Count > 0 ? completedRatings.Max() : null,
                NextPuzzleNumber = puzzles.Where(p => !completedIds.Contains(p.Id)).Min(p => (int?)p.Number),
                LastPuzzleNumber = puzzles.Max(p => (int?)p.Number),

                ByDifficulty = puzzles
                    .GroupBy(p => p.Difficulty)
                    .OrderBy(g => KnownFirst(Array.IndexOf(_difficultyOrder, g.Key)))
                    .Select(g => Group(g.Key, g.Count(p => completedIds.Contains(p.Id)), g.Count()))
                    .ToList(),

                ByRating = puzzles
                    .GroupBy(p => RatingBand(p.Rating))
                    .OrderBy(g => KnownFirst(Array.FindIndex(_ratingBands, b => b.Name == g.Key)))
                    .Select(g => Group(g.Key, g.Count(p => completedIds.Contains(p.Id)), g.Count()))
                    .ToList(),

                // Most-solved categories first, then the biggest ones
                ByCategory = puzzles
                    .GroupBy(p => p.Category)
                    .Select(g => Group(g.Key, g.Count(p => completedIds.Contains(p.Id)), g.Count()))
                    .OrderByDescending(g => g.Completed)
                    .ThenByDescending(g => g.Total)
                    .ToList(),
            };

            return Result<PuzzleStatsDto>.Success(stats);
        }

        // Unknown groups (index -1) go last
        private static int KnownFirst(int index) => index < 0 ? int.MaxValue : index;

        private static PuzzleStatGroupDto Group(string name, int completed, int total) =>
            new() { Name = name, Completed = completed, Total = total };
    }
}
