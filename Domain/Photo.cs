namespace Domain;

public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Url { get; set; }
    public required string PublicId { get; set; }

    // Navigation properties
    public string? PuzzleId { get; set; }
    public virtual Puzzle Puzzle { get; set; } = null!;
    public string? AnnouncementId { get; set; }
    public virtual Announcement Announcement { get; set; } = null!;
}
