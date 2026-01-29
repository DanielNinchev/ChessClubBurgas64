using Application.Announcements.Commands;
using Application.Announcements.DTOs;
using Application.Announcements.Queries;
using Application.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AnnouncementsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<AnnouncementDto, DateTime?>>> GetAnnouncements(
            [FromQuery]AnnouncementParams activityParams)
    {
        return HandleResult(await Mediator.Send(new GetAnnouncementList.Query{Params = activityParams}));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnnouncementDto>> GetActivityDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetAnnouncementDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateAnnouncementDto activityDto)
    {
        return HandleResult(await Mediator.Send(new CreateAnnouncement.Command { AnnouncementDto = activityDto }));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult> EditActivity(string id, EditAnnouncementDto activity)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new EditAnnouncement.Command { AnnouncementDto = activity }));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteAnnouncement.Command { Id = id }));
    }
}
