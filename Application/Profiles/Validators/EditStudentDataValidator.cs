using Application.Profiles.Commands;
using FluentValidation;

namespace Application.Profiles.Validators;

// Every field is optional; the rules only apply when a value is given
public class EditStudentDataValidator : AbstractValidator<EditStudentData.Command>
{
    public EditStudentDataValidator()
    {
        RuleFor(x => x.StudentData.Address).MaximumLength(200);
        RuleFor(x => x.StudentData.School).MaximumLength(150);
        RuleFor(x => x.StudentData.PhoneNumber)
            .Matches(@"^\+?[0-9\s\-()]{6,20}$")
            .WithMessage("Невалиден телефонен номер")
            .When(x => !string.IsNullOrWhiteSpace(x.StudentData.PhoneNumber));
        RuleFor(x => x.StudentData.BirthDate)
            .InclusiveBetween(new DateTime(1900, 1, 1), DateTime.UtcNow)
            .WithMessage("Невалидна дата на раждане")
            .When(x => x.StudentData.BirthDate.HasValue);
    }
}
