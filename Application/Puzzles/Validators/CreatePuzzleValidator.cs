using Application.Puzzles.Commands;
using FluentValidation;

namespace Application.Puzzles.Validators
{
    public class CreatePuzzleValidator : AbstractValidator<CreatePuzzle.Command>
    {
        public CreatePuzzleValidator()
        {
            RuleFor(x => x.Puzzle.Number).NotEmpty().WithMessage("Номерът на задачата е задължителен");
            RuleFor(x => x.Puzzle.Description).NotEmpty().WithMessage("Описанието е задължително");
            RuleFor(x => x.Puzzle.Fen).NotEmpty().WithMessage("FEN позицията е задължителна");
            RuleFor(x => x.Puzzle.Solution).NotEmpty().WithMessage("Решението е задължително");
            RuleFor(x => x.Puzzle.Difficulty).NotEmpty().WithMessage("Трудността е задължителна");
        }
    }

    public class EditPuzzleValidator : AbstractValidator<EditPuzzle.Command>
    {
        public EditPuzzleValidator()
        {
            RuleFor(x => x.Puzzle.Number).NotEmpty().WithMessage("Номерът на задачата е задължителен");
            RuleFor(x => x.Puzzle.Description).NotEmpty().WithMessage("Описанието е задължително");
            RuleFor(x => x.Puzzle.Fen).NotEmpty().WithMessage("FEN позицията е задължителна");
            RuleFor(x => x.Puzzle.Solution).NotEmpty().WithMessage("Решението е задължително");
            RuleFor(x => x.Puzzle.Difficulty).NotEmpty().WithMessage("Трудността е задължителна");
        }
    }
}