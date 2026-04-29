using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Commands;

public class CompletePuzzle
{
    public class Command : IRequest<Result<int>>
    {
        public Guid PuzzleId { get; set; }
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context)
        : IRequestHandler<Command, Result<int>>
    {
        public async Task<Result<int>> Handle(Command request, CancellationToken cancellationToken)
        {
            var puzzle = await context.Puzzles.FindAsync([request.PuzzleId], cancellationToken);
            if (puzzle == null) return Result<int>.Failure("Задачата не е намерена", 404);

            var user = await context.Users
                .Include(u => u.CompletedPuzzles)
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            if (user == null) return Result<int>.Failure("Потребителят не е намерен", 404);

            // Don't award points twice
            var alreadyCompleted = user.CompletedPuzzles.Any(p => p.Id == request.PuzzleId);
            if (alreadyCompleted)
                return Result<int>.Success(user.Rating);

            user.CompletedPuzzles.Add(puzzle);
            user.Rating += puzzle.Points;

            await context.SaveChangesAsync(cancellationToken);

            return Result<int>.Success(user.Rating);
        }
    }
}