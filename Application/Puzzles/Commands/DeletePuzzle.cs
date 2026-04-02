using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Puzzles.Commands
{
    public class DeletePuzzle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var puzzle = await context.Puzzles
                    .FirstOrDefaultAsync(p => p.Id == Guid.Parse(request.Id), cancellationToken);

                if (puzzle == null) return Result<Unit>.Failure("Задачата не е намерена", 404);

                context.Puzzles.Remove(puzzle);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Неуспешно изтриване на задача", 400);
            }
        }
    }
}