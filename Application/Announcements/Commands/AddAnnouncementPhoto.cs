using Application.Announcements.DTOs;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Announcements.Commands;

public class AddAnnouncementPhoto
{
    public class Command : IRequest<Result<PhotoDto>>
    {
        public required string AnnouncementId { get; set; }
        public IFormFile? File { get; set; }
    }

    public class Handler(AppDbContext context, IPhotoService photoService) : IRequestHandler<Command, Result<PhotoDto>>
    {
        public async Task<Result<PhotoDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            if (request.File == null)
                return Result<PhotoDto>.Failure("Снимката е задължителна", 400);

            var announcement = await context.Announcements
                .Include(a => a.Photos)
                .FirstOrDefaultAsync(a => a.Id == request.AnnouncementId, cancellationToken);

            if (announcement == null)
                return Result<PhotoDto>.Failure("Новината не е намерена", 404);

            var photoUploadResult = await photoService.UploadPhotoAsync(request.File);

            if (photoUploadResult == null)
                return Result<PhotoDto>.Failure("Неуспешно качване на снимка", 400);

            var isMain = announcement.Photos.Count == 0;
            var photo = new Photo
            {
                Id = photoUploadResult.PublicId,
                Url = photoUploadResult.Url.ToString(),
                IsMain = isMain,
                AnnouncementId = announcement.Id,
            };

            if (isMain)
                announcement.MainPhotoUrl = photo.Url;

            announcement.Photos.Add(photo);
            await context.SaveChangesAsync(cancellationToken);

            return Result<PhotoDto>.Success(photo.ToDto());
        }
    }
}