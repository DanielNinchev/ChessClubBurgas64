using ChessClubBurgas64.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ChessClubBurgas64.Infrastructure.Security
{
    public class IsChessClubAdminRequirement : IAuthorizationRequirement
    {

    }

    public class IsChessClubAdminRequirementHandler(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor) : AuthorizationHandler<IsChessClubAdminRequirement>
    {
        private readonly AppDbContext _dbContext = dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsChessClubAdminRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            //var announcementId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
            //    .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            //var attendee = _dbContext.ActivityAttendees
            //    .AsNoTracking()
            //    .FirstOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == announcementId)
            //    .Result;

            //if (attendee == null) return Task.CompletedTask;

            //if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
