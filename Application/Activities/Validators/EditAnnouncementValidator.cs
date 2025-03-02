using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

public class EditAnnouncementValidator : BaseAnnouncementValidator<EditAnnouncement.Command, EditAnnouncementDto>
{
    public EditAnnouncementValidator() : base(x => x.AnnouncementDto)
    {
        RuleFor(x => x.AnnouncementDto.Id)
            .NotEmpty()
            .WithMessage("Id is required");
    }
}
