using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Puzzles.Commands
{
    public class CreatePuzzle
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreatePuzzleDto Puzzle { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var puzzle = new Puzzle
                {
                    Id = Guid.NewGuid(),
                    Title = request.Puzzle.Title,
                    Description = request.Puzzle.Description,
                    Fen = request.Puzzle.Fen,
                    Solution = request.Puzzle.Solution,
                    Difficulty = request.Puzzle.Difficulty,
                    Date = request.Puzzle.Date,
                };

                context.Puzzles.Add(puzzle);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                    ? Result<string>.Success(puzzle.Id.ToString())
                    : Result<string>.Failure("Неуспешно създаване на задача", 400);
            }
        }
    }
}