using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Student
    {
        [Key]
        public Guid Id { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Address { get; set; }

        public string? School { get; set; }

        public DateTime? DateOfJoiningClub { get; set; }

        public int? ClubRating { get; set; }

        public int? FideRating { get; set; }

        public int? PuzzlePoints { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.Now;

        public DateTime DateUpdated { get; set; } = DateTime.Now;

        public Guid AccountId { get; set; }

        public virtual required Account Account { get; set; }
    }
}
