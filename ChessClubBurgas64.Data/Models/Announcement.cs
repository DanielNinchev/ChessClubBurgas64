#nullable disable
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Announcement
    {
        public Announcement()
        {
            Images = new HashSet<Image>();
        }

        [Key]
        public Guid Id { get; set; }

        public string Title { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public DateTime DateUpdated { get; set; } = DateTime.UtcNow;

        public string Description { get; set; }

        public string Text { get; set; }

        public virtual ICollection<Image> Images { get; set; }
    }
}
