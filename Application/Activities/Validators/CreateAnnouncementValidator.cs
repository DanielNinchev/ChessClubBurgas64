using Application.Activities.Commands;
using Application.Activities.DTOs;

namespace Application.Activities.Validators;

public class CreateAnnouncementValidator : BaseAnnouncementValidator<CreateAnnouncement.Command, CreateAnnouncementDto>
{
    public CreateAnnouncementValidator() : base(x => x.AnnouncementDto)
    {
    }
}
