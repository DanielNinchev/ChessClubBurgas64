namespace Application.Announcements.DTOs;

public class BaseAnnouncementDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string Text { get; set; }
}
