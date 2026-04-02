using Application.Announcements.DTOs;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Announcements.Commands;

public class EditAnnouncement
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditAnnouncementDto AnnouncementDto { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var announcement = await context.Announcements
                .FindAsync([request.AnnouncementDto.Id], cancellationToken);

            if (announcement == null) return Result<Unit>.Failure("Обявата не е намерена", 404);

            request.AnnouncementDto.ApplyTo(announcement);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Неуспешно редактиране на обява", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
