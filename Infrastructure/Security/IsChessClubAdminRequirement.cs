using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace Infrastructure.Security;

public class IsChessClubAdminRequirement : IAuthorizationRequirement
{
}

public class IsChessClubAdminRequirementHandler(UserManager<Account> userManager) : AuthorizationHandler<IsChessClubAdminRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context, IsChessClubAdminRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return;

        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return;

        if (await userManager.IsInRoleAsync(user, "Admin"))
        {
            context.Succeed(requirement);
        }
    }
}
