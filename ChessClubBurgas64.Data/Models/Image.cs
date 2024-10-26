#nullable disable
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Image
    {
        [Key]
        public Guid Id { get; set; }

        public string Url { get; set; }

        public string Info { get; set; }

        public Guid AnnouncementId { get; set; }

        public virtual Announcement Announcement { get; set; }

        //public Guid PuzzleId { get; set; }

        //public virtual Puzzle Puzzle { get; set; }
    }
}
