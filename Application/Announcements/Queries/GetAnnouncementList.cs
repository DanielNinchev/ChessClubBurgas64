using Application.Announcements.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Announcements.Queries;

public class GetAnnouncementList
{
    public class Query : IRequest<Result<PagedList<AnnouncementDto, DateTime?>>> 
    {
        public required AnnouncementParams Params { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) :  IRequestHandler<Query, Result<PagedList<AnnouncementDto, DateTime?>>>
    {
        public async Task<Result<PagedList<AnnouncementDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Announcements
                .OrderBy(x => x.Date)
                .Where(x => x.Date >= (request.Params.Cursor ?? request.Params.StartDate))
                .AsQueryable();

            var projectedAnnouncements = query.ProjectTo<AnnouncementDto>(mapper.ConfigurationProvider,  new {currentUserId = userAccessor.GetUserId()});
            var announcements = await projectedAnnouncements
                .Take(request.Params.PageSize + 1)
                .ToListAsync(cancellationToken);

            DateTime? nextCursor = null;
            if (announcements.Count > request.Params.PageSize)
            {
                nextCursor = announcements.Last().Date;
                announcements.RemoveAt(announcements.Count - 1);
            }

            return Result<PagedList<AnnouncementDto, DateTime?>>.Success(
                new PagedList<AnnouncementDto, DateTime?>
                {
                    Items = announcements,
                    NextCursor = nextCursor
                }
            );
        }
    }
}
