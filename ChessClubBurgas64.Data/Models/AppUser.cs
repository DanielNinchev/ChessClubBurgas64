#nullable disable
using Microsoft.AspNetCore.Identity;

namespace ChessClubBurgas64.Data.Models
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
    }
}
