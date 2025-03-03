using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetProfile
{
    public class Query : IRequest<Result<ProfileDto>>
    {
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) 
        : IRequestHandler<Query, Result<ProfileDto>>
    {
        public async Task<Result<ProfileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profile = await context.Users
                .ProjectTo<ProfileDto>(mapper.ConfigurationProvider, 
                    new {currentUserId = userAccessor.GetUserId()})
                .SingleOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

            return profile == null
                ? Result<ProfileDto>.Failure("Profile not found", 404)
                : Result<ProfileDto>.Success(profile);
        }
    }
}
