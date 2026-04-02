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
            [FromQuery] AnnouncementParams announcementParams)
    {
        return HandleResult(await Mediator.Send(new GetAnnouncementList.Query { Params = announcementParams }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnnouncementDto>> GetAnnouncementDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetAnnouncementDetails.Query { Id = id }));
    }

    [HttpPost]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult<string>> CreateAnnouncement(
        [FromForm] CreateAnnouncementDto announcementDto,
        [FromForm] IFormFile file)
    {
        return HandleResult(await Mediator.Send(new CreateAnnouncement.Command
        {
            AnnouncementDto = announcementDto,
            File = file,
        }));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult> EditAnnouncement(string id, EditAnnouncementDto announcementDto)
    {
        announcementDto.Id = id;
        return HandleResult(await Mediator.Send(new EditAnnouncement.Command { AnnouncementDto = announcementDto }));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult> DeleteAnnouncement(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteAnnouncement.Command { Id = id }));
    }

    [HttpPost("{id}/photos")]
    [Authorize(Policy = "IsChessClubAdmin")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(string id, [FromForm] IFormFile file)
    {
        return HandleResult(await Mediator.Send(new AddAnnouncementPhoto.Command
        {
            AnnouncementId = id,
            File = file,
        }));
    }
}
