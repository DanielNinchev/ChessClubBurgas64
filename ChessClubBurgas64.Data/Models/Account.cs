using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

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

        public Guid MemberId { get; set; }

        public virtual Student? Member { get; set; }

        [IgnoreDataMember]
        public string DisplayName => $"{FirstName} {LastName}";
    }
}
