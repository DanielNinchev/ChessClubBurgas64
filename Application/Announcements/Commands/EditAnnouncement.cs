using Application.Announcements.DTOs;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Announcements.Commands;

public class EditAnnouncement
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditAnnouncementDto AnnouncementDto { get; set; }
        public IFormFile? File { get; set; }
    }

    public class Handler(AppDbContext context, IPhotoService photoService)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Include Photos so the collection is tracked by EF
            var announcement = await context.Announcements
                .Include(a => a.Photos)
                .FirstOrDefaultAsync(a => a.Id == request.AnnouncementDto.Id, cancellationToken);

            if (announcement == null)
                return Result<Unit>.Failure("Обявата не е намерена", 404);

            request.AnnouncementDto.ApplyTo(announcement);

            if (request.File != null)
            {
                // Find the existing main photo to get its Cloudinary public ID
                var existingMainPhoto = announcement.Photos.FirstOrDefault(p => p.IsMain);

                if (existingMainPhoto != null)
                {
                    // Delete from Cloudinary using the public ID (not the URL)
                    var deleteResult = await photoService.DeletePhotoAsync(existingMainPhoto.Id);
                    if (deleteResult == null || deleteResult.Error != null)
                        return Result<Unit>.Failure("Неуспешно изтриване на снимката.", 400);

                    // Remove from DB
                    context.Photos.Remove(existingMainPhoto);
                }

                // Upload new photo to Cloudinary
                var uploadResult = await photoService.UploadPhotoAsync(request.File);
                if (uploadResult == null || uploadResult.Error != null)
                    return Result<Unit>.Failure("Неуспешно качване на снимката.", 400);

                // Add new photo to DB
                var newPhoto = new Photo
                {
                    Id = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString(),
                    IsMain = true,
                    AnnouncementId = announcement.Id,
                };

                announcement.Photos.Add(newPhoto);
                announcement.MainPhotoUrl = newPhoto.Url;
            }

            var success = await context.SaveChangesAsync(cancellationToken) >= 0; // photo removal + re-add counts as changes but text-only with no changes returns 0
            if (!success)
                return Result<Unit>.Failure("Неуспешно редактиране на обява", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
