using Application.Announcements.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) 
        : IRequestHandler<Query, Result<AnnouncementDto>>
    {
        public async Task<Result<AnnouncementDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await context.Announcements
                .ProjectTo<AnnouncementDto>(mapper.ConfigurationProvider, 
                    new {currentUserId = userAccessor.GetUserId()})
                .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);

            if (activity == null) return Result<AnnouncementDto>.Failure("Activity not found", 404);

            return Result<AnnouncementDto>.Success(activity);
        }
    }
}
