#nullable disable
namespace ChessClubBurgas64.Web.Models.AccountModels
{
    public class AccountViewModel
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsAdmin { get; set; }
    }
}
