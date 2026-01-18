using Application.Announcements.Commands;
using Application.Announcements.DTOs;

namespace Application.Announcements.Validators;

public class CreateAnnouncementValidator : BaseAnnouncementValidator<CreateAnnouncement.Command, CreateAnnouncementDto>
{
    public CreateAnnouncementValidator() : base(x => x.AnnouncementDto)
    {
    }
}
