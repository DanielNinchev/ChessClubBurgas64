using Application.Announcements.Commands;
using Application.Announcements.DTOs;
using FluentValidation;

namespace Application.Announcements.Validators;

public class EditAnnouncementValidator : BaseAnnouncementValidator<EditAnnouncement.Command, EditAnnouncementDto>
{
    public EditAnnouncementValidator() : base(x => x.AnnouncementDto)
    {
        RuleFor(x => x.AnnouncementDto.Id)
            .NotEmpty()
            .WithMessage("Id is required");
    }
}
