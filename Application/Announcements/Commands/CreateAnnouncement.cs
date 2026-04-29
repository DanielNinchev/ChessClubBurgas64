using Application.Announcements.DTOs;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Announcements.Commands;

public class CreateAnnouncement
{
    public class Command : IRequest<Result<string>>
    {
        public required CreateAnnouncementDto AnnouncementDto { get; set; }
        public required IFormFile File { get; set; }
    }

    public class Handler(AppDbContext context, IPhotoService photoService) : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            var photoUploadResult = await photoService.UploadPhotoAsync(request.File);
            if (photoUploadResult == null || photoUploadResult.Error != null)
                return Result<string>.Failure("Неуспешно качване на снимката.", 400);

            var announcement = new Announcement
            {
                Title = request.AnnouncementDto.Title,
                Description = request.AnnouncementDto.Description,
                Text = request.AnnouncementDto.Text,
                Date = DateTime.UtcNow,
                Photos = [],
            };

            var photo = new Photo
            {
                Id = photoUploadResult.PublicId,
                Url = photoUploadResult.Url.ToString(),
                IsMain = true,
                AnnouncementId = announcement.Id
            };

            announcement.Photos.Add(photo);
            announcement.MainPhotoUrl = photo.Url;

            context.Announcements.Add(announcement);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<string>.Success(announcement.Id)
                : Result<string>.Failure("Неуспешно публикуване на новината.", 400);
        }
    }
}
