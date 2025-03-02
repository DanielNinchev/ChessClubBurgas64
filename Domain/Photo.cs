namespace Domain;

public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Url { get; set; }
    public required string PublicId { get; set; }

    // Navigation properties
    public required string PuzzleId { get; set; }
    public virtual Puzzle Puzzle { get; set; } = null!;
    public required string AnnouncementId { get; set; }
    public virtual Announcement Announcement { get; set; } = null!;
}
