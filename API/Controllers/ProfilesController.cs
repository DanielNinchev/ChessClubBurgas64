using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using Application.Profiles.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    [HttpGet("{userId}")]
    public async Task<ActionResult<ProfileDto>> GetProfile(string userId)
    {
        return HandleResult(await Mediator.Send(new GetProfile.Query { UserId = userId }));
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProfile(EditProfile.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }
}
