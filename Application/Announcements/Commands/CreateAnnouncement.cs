using Application.Announcements.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Announcements.Commands;

public class CreateAnnouncement
{
    public class Command : IRequest<Result<string>>
    {
        public required CreateAnnouncementDto AnnouncementDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            var announcement = mapper.Map<Announcement>(request.AnnouncementDto);

            context.Announcements.Add(announcement);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<string>.Failure("Failed to create the announcement", 400);

            return Result<string>.Success(announcement.Id);
        }
    }
}
