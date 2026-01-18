using Application.Profiles.Commands;
using FluentValidation;

namespace Application.Profiles.Validators;

public class EditProfileValidator : AbstractValidator<EditProfile.Command>
{
    public EditProfileValidator()
    {
        RuleFor(x => x.ProfileData.FirstName).NotEmpty();
        RuleFor(x => x.ProfileData.MiddleName).NotEmpty();
        RuleFor(x => x.ProfileData.LastName).NotEmpty();
        RuleFor(x => x.ProfileData.PhoneNumber).NotEmpty();
        RuleFor(x => x.ProfileData.BirthDate).NotEmpty();
    }
}
