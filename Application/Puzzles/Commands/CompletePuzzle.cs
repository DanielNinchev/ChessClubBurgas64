using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Commands;

public class CompletePuzzle
{
    public class Command : IRequest<Result<CompletePuzzleResultDto>>
    {
        public Guid PuzzleId { get; set; }
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context)
        : IRequestHandler<Command, Result<CompletePuzzleResultDto>>
    {
        public async Task<Result<CompletePuzzleResultDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var puzzle = await context.Puzzles.FindAsync([request.PuzzleId], cancellationToken);
            if (puzzle == null) return Result<CompletePuzzleResultDto>.Failure("Задачата не е намерена", 404);

            var user = await context.Users
                .Include(u => u.CompletedPuzzles)
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            if (user == null) return Result<CompletePuzzleResultDto>.Failure("Потребителят не е намерен", 404);

            var alreadyCompleted = user.CompletedPuzzles.Any(p => p.Id == request.PuzzleId);
            var pointsAwarded = false;

            // Don't award points twice
            if (!alreadyCompleted)
            {
                var nextNumber = await NextPuzzleNumber(user.CompletedPuzzles, cancellationToken);

                // Students must solve puzzles in number order; an out-of-order solve is not counted
                if (user.StudentProfile == null || puzzle.Number <= nextNumber)
                {
                    user.CompletedPuzzles.Add(puzzle);
                    user.Rating += puzzle.Points;
                    if (user.StudentProfile != null)
                        user.StudentProfile.PuzzlePoints = (user.StudentProfile.PuzzlePoints ?? 0) + puzzle.Points;

                    await context.SaveChangesAsync(cancellationToken);
                    pointsAwarded = true;
                }
            }

            return Result<CompletePuzzleResultDto>.Success(new CompletePuzzleResultDto
            {
                Rating = user.Rating,
                PointsAwarded = pointsAwarded,
                AlreadyCompleted = alreadyCompleted,
                NextPuzzleNumber = await NextPuzzleNumber(user.CompletedPuzzles, cancellationToken),
            });
        }

        private async Task<int?> NextPuzzleNumber(ICollection<Domain.Puzzle> completed, CancellationToken cancellationToken)
        {
            var completedIds = completed.Select(p => p.Id).ToList();
            return await context.Puzzles
                .Where(p => !completedIds.Contains(p.Id))
                .MinAsync(p => (int?)p.Number, cancellationToken);
        }
    }
}
