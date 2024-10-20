using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Account : IdentityUser
    {
        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string MiddleName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public bool IsAdmin { get; set; }

        public bool IsConfirmed {  get; set; }

        public Guid? StudentId { get; set; }

        public virtual Student? Student { get; set; }

        public string? Username => Email;
    }
}
