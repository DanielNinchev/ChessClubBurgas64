using Application.Announcements.DTOs;
using FluentValidation;

namespace Application.Announcements.Validators;

public class BaseAnnouncementValidator<T, TDto> : AbstractValidator<T> where TDto
    : BaseAnnouncementDto
{
    public BaseAnnouncementValidator(Func<T, TDto> selector)
    {
        RuleFor(x => selector(x).Title)
            .NotEmpty().WithMessage("Заглавието е задължително")
            .MaximumLength(100).WithMessage("Заглавието не трябва да надвишава 100 символа");
        RuleFor(x => selector(x).Description)
            .NotEmpty().WithMessage("Описанието е задължително");
    }
}
