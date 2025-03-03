using Application.Announcements.DTOs;
using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Announcements.Commands;

public class EditAnnouncement
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditAnnouncementDto AnnouncementDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Announcements.FindAsync([request.AnnouncementDto.Id], cancellationToken);

            if (activity == null) return Result<Unit>.Failure("Announcement not found", 404);

            mapper.Map(request.AnnouncementDto, activity);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to update the announcement", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
