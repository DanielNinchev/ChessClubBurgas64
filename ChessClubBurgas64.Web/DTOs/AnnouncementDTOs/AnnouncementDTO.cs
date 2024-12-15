#nullable disable

using ChessClubBurgas64.Data.Models;

namespace ChessClubBurgas64.Web.DTOs.AnnouncementDTOs
{
    public class AnnouncementDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string Description { get; set; }
        public string Text { get; set; }
        public string MainImageUrl { get; set; }
        public List<Image> Images { get; set; }
    }
}
