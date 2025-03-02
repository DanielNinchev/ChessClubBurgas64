using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index(nameof(Date))]
public class Announcement
{
    public Announcement()
    {
        Photos = new HashSet<Photo>();
    }

    public required string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public required string Description { get; set; }
    public required string Text { get; set; }

    // Navigation properties
    public virtual ICollection<Photo> Photos { get; set; }
}
