using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands;

public class EditStudentData
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditStudentDataDto StudentData { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();

            var studentProfile = await context.StudentProfiles
                .FirstOrDefaultAsync(s => s.AccountId == user.Id, cancellationToken);

            if (studentProfile == null)
                return Result<Unit>.Failure("Ученическият профил не е намерен", 404);

            request.StudentData.ApplyTo(studentProfile);

            // Saving unchanged data is still a success
            await context.SaveChangesAsync(cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
