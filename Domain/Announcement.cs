using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Date))]
public class Announcement
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string Text { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? MainPhotoUrl { get; set; }
    public List<Photo> Photos { get; set; } = [];
}
