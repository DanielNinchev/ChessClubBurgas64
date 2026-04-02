using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Announcements.Commands;

public class DeleteAnnouncement
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context, IPhotoService photoService) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var announcement = await context.Announcements
                .Include(a => a.Photos)
                .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

            if (announcement == null)
                return Result<Unit>.Failure("Обявата не е намерена", 404);

            // Delete all photos from Cloudinary
            foreach (var photo in announcement.Photos)
            {
                await photoService.DeletePhotoAsync(photo.Id);
            }

            context.Announcements.Remove(announcement);
            await context.SaveChangesAsync(cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
