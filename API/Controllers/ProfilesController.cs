using System.Security.Claims;
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
        return HandleResult(await Mediator.Send(new GetProfile.Query
        {
            UserId = userId,
            RequesterId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            RequesterIsAdmin = User.IsInRole("Admin"),
        }));
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProfile(EditProfileDto profileData)
    {
        return HandleResult(await Mediator.Send(new EditProfile.Command { ProfileData = profileData }));
    }

    [HttpPut("student-data")]
    public async Task<ActionResult> UpdateStudentData(EditStudentDataDto studentData)
    {
        return HandleResult(await Mediator.Send(new EditStudentData.Command { StudentData = studentData }));
    }
}
