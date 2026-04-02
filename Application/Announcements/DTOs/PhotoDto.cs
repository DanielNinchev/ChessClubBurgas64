namespace Application.Announcements.DTOs;

public class PhotoDto
{
    public string Id { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; }
}