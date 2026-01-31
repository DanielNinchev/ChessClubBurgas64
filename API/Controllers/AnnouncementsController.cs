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
            [FromQuery] AnnouncementParams AnnouncementParams)
    {
        return HandleResult(await Mediator.Send(new GetAnnouncementList.Query { Params = AnnouncementParams }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnnouncementDto>> GetAnnouncementDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetAnnouncementDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateAnnouncement(CreateAnnouncementDto AnnouncementDto)
    {
        return HandleResult(await Mediator.Send(new CreateAnnouncement.Command { AnnouncementDto = AnnouncementDto }));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult> EditAnnouncement(string id, EditAnnouncementDto Announcement)
    {
        Announcement.Id = id;
        return HandleResult(await Mediator.Send(new EditAnnouncement.Command { AnnouncementDto = Announcement }));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult> DeleteAnnouncement(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteAnnouncement.Command { Id = id }));
    }
}
