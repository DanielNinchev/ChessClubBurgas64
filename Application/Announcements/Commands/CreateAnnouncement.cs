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
        public IFormFile? File { get; set; }
    }

    public class Handler(AppDbContext context, IPhotoService photoService) : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            if (request.File == null)
                return Result<string>.Failure("Снимката е задължителна", 400);

            var photoUploadResult = await photoService.UploadPhotoAsync(request.File);

            if (photoUploadResult == null)
                return Result<string>.Failure("Неуспешно качване на снимка", 400);

            var announcement = request.AnnouncementDto.ToEntity();
            announcement.MainPhotoUrl = photoUploadResult.Url.ToString();

            var photo = new Photo
            {
                Id = photoUploadResult.PublicId,
                Url = photoUploadResult.Url.ToString(),
                IsMain = true,
                AnnouncementId = announcement.Id,
            };

            announcement.Photos.Add(photo);

            context.Announcements.Add(announcement);
            await context.SaveChangesAsync(cancellationToken);

            return Result<string>.Success(announcement.Id);
        }
    }
}
