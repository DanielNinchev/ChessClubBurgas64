#nullable disable
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Web.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [PasswordPropertyText]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Паролата трябва да бъде сигурна!")]
        public string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string MiddleName { get; set; }

        [Required]
        public string LastName { get; set; }



        [Required]
        public bool IsAdmin {  get; set; }
    }
}
