using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsChessClubAdminRequirement : IAuthorizationRequirement
{
}

public class IsChessClubAdminRequirementHandler(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor) : AuthorizationHandler<IsChessClubAdminRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsChessClubAdminRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return;

        var httpContext = httpContextAccessor.HttpContext;
        var account = await dbContext.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == userId && x.IsAdmin);
        
        if (account == null) return;

        context.Succeed(requirement);
    }
}
