#nullable disable
using ChessClubBurgas64.Infrastructure.Security.Contracts;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ChessClubBurgas64.Infrastructure.Security
{
    public class UserAccessor(IHttpContextAccessor httpContextAccessor) : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public string GetUsername()
        {
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}
