using ChessClubBurgas64.Data.Models;

namespace ChessClubBurgas64.Web.Services.Contracts
{
    public interface ITokenService
    {
        string CreateToken(Account user);
    }
}
