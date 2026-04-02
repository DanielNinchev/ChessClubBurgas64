using Application.Announcements.DTOs;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Announcements.Queries;

public class GetAnnouncementDetails
{
    public class Query : IRequest<Result<AnnouncementDto>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<AnnouncementDto>>
    {
        public async Task<Result<AnnouncementDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var announcement = await context.Announcements
                .Where(a => a.Id == request.Id)
                .ProjectToDto()
                .FirstOrDefaultAsync(cancellationToken);

            if (announcement == null) return Result<AnnouncementDto>.Failure("Обявата не е намерена", 404);

            return Result<AnnouncementDto>.Success(announcement);
        }
    }
}
