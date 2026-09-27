using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands;

public class EditProfile
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditProfileDto ProfileData { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();

            var account = await context.Users
                .Include(u => u.TeacherProfile)
                .FirstOrDefaultAsync(u => u.Id == user.Id, cancellationToken);

            if (account == null)
                return Result<Unit>.Failure("Профилът не е намерен", 404);

            // Apply common fields
            request.ProfileData.ApplyTo(account);

            // Apply role-specific fields (student data has its own command: EditStudentData)
            if (account.TeacherProfile != null)
            {
                request.ProfileData.ApplyTo(account.TeacherProfile);
            }

            // Saving unchanged data is still a success
            await context.SaveChangesAsync(cancellationToken);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
