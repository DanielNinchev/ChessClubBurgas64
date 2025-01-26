using Microsoft.AspNetCore.Mvc;
using ChessClubBurgas64.Data.Models;
using Microsoft.AspNetCore.Authorization;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Extensions;
using ChessClubBurgas64.Web.Models.AnnouncementModels;
using ChessClubBurgas64.Web.Services.Contracts;

namespace ChessClubBurgas64.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementsController(ILoggerFactory loggerFactory, IAnnouncementsService announcementsService) : ControllerBase
    {
        private readonly IAnnouncementsService _announcementsService = announcementsService;
        private readonly ILogger<AnnouncementsController> _logger = loggerFactory.CreateLogger<AnnouncementsController>();

        [AllowAnonymous]
        [HttpGet]
        public async Task<IResult> GetAnnouncements([FromQuery] AnnouncementParams pagingParams)
        {
            var pagedResult = await _announcementsService.GetAnnouncementAsync(pagingParams);
            if (pagedResult == null)
            {
                return Results.NotFound();
            }

            Response.AddPaginationHeader(pagedResult.CurrentPage, pagedResult.PageSize, pagedResult.TotalCount, pagedResult.TotalPages);
            return Results.Ok(pagedResult);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<AnnouncementInputModel>> GetAnnouncement(Guid id)
        {
            var result = await _announcementsService.GetAnnouncementAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPost]
        public async Task<ActionResult<AnnouncementInputModel>> PostAnnouncement([FromForm] Announcement announcement, [FromForm] IFormFile mainImage)
        {
            var result = await _announcementsService.CreateAnnouncementAsync(announcement, mainImage);

            return CreatedAtAction("GetAnnouncement", new { id = announcement.Id }, result);
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPut("{id}")]
        public async Task<IResult> PutAnnouncement(Guid id, [FromForm] Announcement updatedAnnouncement, [FromForm] IFormFile mainImage)
        {
            await _announcementsService.UpdateAnnouncementAsync(id, updatedAnnouncement, mainImage);

            return Results.NoContent();
        }

        [Authorize("IsChessClubAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            try
            {
                await _announcementsService.DeleteAnnouncementAsync(id);

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"An error occurred while deleting announcement! Error message {e.Message}");
                throw;
            }
        }
    }
}
