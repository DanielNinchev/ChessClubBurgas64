using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Announcements.Commands;

public class SetMainPhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string AnnouncementId { get; set; }
        public required string PhotoId { get; set; }
    }

    public class Handler(AppDbContext context) 
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var announcement = await context.Announcements
                .Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.Id == request.AnnouncementId, cancellationToken);

            if (announcement == null) return Result<Unit>.Failure("Cannot find photo", 400);

            var photo = await context.Photos.FirstOrDefaultAsync(x => x.Id == request.PhotoId, cancellationToken);
            if (photo == null) return Result<Unit>.Failure("Cannot find photo", 400);

            announcement.MainPhotoUrl = photo.Url;
            announcement.Photos.Add(photo);
            photo.AnnouncementId = announcement.Id;

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating photo", 400);
        }
    }
}
