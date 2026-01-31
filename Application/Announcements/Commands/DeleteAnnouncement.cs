using Application.Core;
using MediatR;
using Persistence;

namespace Application.Announcements.Commands;

public class DeleteAnnouncement
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var announcement = await context.Announcements
                .FindAsync([request.Id], cancellationToken);

            if (announcement == null) return Result<Unit>.Failure("Announcement not found", 404);

            context.Remove(announcement);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete the announcement", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
