namespace Domain;

public class Photo
{
    public required string Id { get; set; }
    public required string Url { get; set; }
    public bool IsMain { get; set; }

    // Foreign key
    public required string AnnouncementId { get; set; }

    // Navigation property
    public virtual Announcement Announcement { get; set; } = null!;
}
