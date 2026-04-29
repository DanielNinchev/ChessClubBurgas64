using Application.Core;
using Application.Puzzles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Commands
{
    public class EditPuzzle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required EditPuzzleDto Puzzle { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var puzzle = await context.Puzzles
                    .FirstOrDefaultAsync(p => p.Id == Guid.Parse(request.Puzzle.Id), cancellationToken);

                if (puzzle == null) return Result<Unit>.Failure("Задачата не е намерена", 404);

                puzzle.Number = request.Puzzle.Number;
                puzzle.Description = request.Puzzle.Description;
                puzzle.Fen = request.Puzzle.Fen;
                puzzle.Solution = request.Puzzle.Solution;
                puzzle.Difficulty = request.Puzzle.Difficulty;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Неуспешно редактиране на задача", 400);
            }
        }
    }
}