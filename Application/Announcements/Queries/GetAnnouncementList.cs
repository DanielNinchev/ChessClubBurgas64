using Application.Announcements.DTOs;
using Application.Core;
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

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<PagedList<AnnouncementDto, DateTime?>>>
    {
        public async Task<Result<PagedList<AnnouncementDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Announcements
                .Include(a => a.Photos)
                .OrderByDescending(a => a.Date)
                .AsQueryable();

            if (request.Params.StartDate != default)
            {
                query = query.Where(a => a.Date >= request.Params.StartDate);
            }

            if (request.Params.Cursor.HasValue)
            {
                query = query.Where(a => a.Date < request.Params.Cursor.Value);
            }

            var announcements = await query
                .Take(request.Params.PageSize + 1)
                .ProjectToDto()
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
                    NextCursor = nextCursor,
                });
        }
    }
}
