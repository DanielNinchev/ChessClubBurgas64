using Domain;

namespace Application.Announcements.DTOs;

public class AnnouncementDto
{
    public required string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public required string Description { get; set; }
    public required string Text { get; set; }
    public required string MainPhotoUrl { get; set; }

    // Navigation properties
    public virtual ICollection<Photo> Photos { get; set; } = new HashSet<Photo>();
}
