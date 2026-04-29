using Domain;

namespace Application.Announcements.DTOs;

public class CreateAnnouncementDto : BaseAnnouncementDto
{
    public Announcement ToEntity()
    {
        return new Announcement
        {
            Title = Title,
            Description = Description,
            Text = Text,
            Photos = [],
        };
    }
}
