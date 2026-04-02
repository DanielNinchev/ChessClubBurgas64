namespace Application.Announcements.DTOs;

public class BaseAnnouncementDto
{
    public string Title { get; set; } = "";
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Text { get; set; } = "";
}
