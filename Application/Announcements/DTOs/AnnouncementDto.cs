using Domain;

namespace Application.Announcements.DTOs;

public class AnnouncementDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string MainPhotoUrl { get; set; } = string.Empty;
    public List<PhotoDto> Photos { get; set; } = [];
}
