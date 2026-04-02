using Application.Core;
using Application.Profiles.DTOs;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetProfile
{
    public class Query : IRequest<Result<ProfileDto>>
    {
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context, UserManager<Account> userManager)
        : IRequestHandler<Query, Result<ProfileDto>>
    {
        public async Task<Result<ProfileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await context.Users
                .Include(u => u.StudentProfile)
                    .ThenInclude(s => s!.Teacher)
                        .ThenInclude(t => t!.Account)
                .Include(u => u.TeacherProfile)
                    .ThenInclude(t => t!.Students)
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
                return Result<ProfileDto>.Failure("Профилът не е намерен", 404);

            var roles = await userManager.GetRolesAsync(user);

            ProfileDto profile = user switch
            {
                _ when user.StudentProfile != null => user.ToStudentProfileDto(roles),
                _ when user.TeacherProfile != null => user.ToTeacherProfileDto(roles),
                _ => user.ToBaseProfileDto(roles),
            };

            return Result<ProfileDto>.Success(profile);
        }
    }
}
