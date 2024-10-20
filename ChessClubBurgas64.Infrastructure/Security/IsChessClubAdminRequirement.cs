using ChessClubBurgas64.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace ChessClubBurgas64.Infrastructure.Security
{
    public class IsChessClubAdminRequirement : IAuthorizationRequirement
    {

    }

    public class IsChessClubAdminRequirementHandler(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor, ILoggerFactory loggerFactory) : AuthorizationHandler<IsChessClubAdminRequirement>
    {
        private readonly AppDbContext _dbContext = dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly ILogger<IsChessClubAdminRequirementHandler> _logger = loggerFactory.CreateLogger<IsChessClubAdminRequirementHandler>();

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsChessClubAdminRequirement requirement)
        {
            var resource = _httpContextAccessor.HttpContext;
            if (resource == null)
            {
                _logger.LogInformation("Failed Authorization! No such resource in the context.");
                context.Fail();
                return Task.CompletedTask;
            }

            var token = resource.Request.Headers.Authorization.ToString();
            if (string.IsNullOrWhiteSpace(token))
            {
                _logger.LogInformation("Failed Authorization! Invalid token!");
                context.Fail();
                return Task.CompletedTask;
            }

            //var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            //if (userId == null)
            //{
            //    context.Fail();
            //    return Task.CompletedTask;
            //}

            //var announcementId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
            //    .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            //var attendee = _dbContext.ActivityAttendees
            //    .AsNoTracking()
            //    .FirstOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == announcementId)
            //    .Result;

            //if (attendee == null) return Task.CompletedTask;

            //if (attendee.IsHost) context.Succeed(requirement);

            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
