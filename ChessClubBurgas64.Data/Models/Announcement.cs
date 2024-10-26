#nullable disable
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Announcement
    {
        public Announcement()
        {
            Images = [];
        }

        [Key]
        public Guid Id { get; set; }

        public string Title { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateUpdated { get; set; }

        public string Description { get; set; }

        public string Text { get; set; }

        public string MainPhotoUrl { get; set; }

        public virtual IEnumerable<Image> Images { get; set; }
    }
}
