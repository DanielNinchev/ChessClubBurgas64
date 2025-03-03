using Application.Core;

namespace Application.Announcements.Queries;

public class AnnouncementParams : PaginationParams<DateTime?>
{
    public string? Filter { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
}
