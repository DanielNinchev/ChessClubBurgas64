using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Application.Core;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Extensions;
using ChessClubBurgas64.Web.DTOs.AnnouncementDTOs;
using ChessClubBurgas64.Infrastructure.Contracts;
using AutoMapper;
using ChessClubBurgas64.Web.Controllers;

namespace ChessClubBurgas64.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementsController(AppDbContext context, IMapper mapper, IImageAccessor imageAccessor, IUserAccessor userAccessor, ILoggerFactory loggerFactory) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IImageAccessor _imageAccessor = imageAccessor;
        private readonly IUserAccessor _userAccessor = userAccessor;
        private readonly ILogger<AnnouncementsController> _logger = loggerFactory.CreateLogger<AnnouncementsController>();

        [AllowAnonymous]
        [HttpGet]
        public async Task<IResult> GetAnnouncements([FromQuery] AnnouncementParams pagingParams)
        {
            if (_context.Announcements == null)
            {
                return Results.NotFound();
            }

            var query = _context.Announcements
                 //.Where(x => x.DateCreated >= pagingParams.StartDate)
                 //.OrderBy(d => d.DateCreated)
                 .AsQueryable();

            
            var pagedResult = await PagedList<Announcement>.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
            Response.AddPaginationHeader(pagedResult.CurrentPage, pagedResult.PageSize, pagedResult.TotalCount, pagedResult.TotalPages);
            return Results.Ok(pagedResult);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Announcement>> GetAnnouncement(Guid id)
        {
            if (_context.Announcements == null)
            {
                return NotFound();
            }

            var Announcement = await _context.Announcements.FindAsync(id);

            if (Announcement == null)
            {
                return NotFound();
            }

            return Announcement;
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncement(Guid id, Announcement announcement)
        {
            if (id != announcement.Id)
            {
                return BadRequest();
            }

            _context.Entry(announcement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnnouncementExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPost]
        public async Task<ActionResult<AnnouncementDTO>> PostAnnouncement([FromForm] Announcement announcement, [FromForm] IFormFile mainImage)
        {
            if (_context.Announcements == null)
            {
                return Problem("Entity set 'AppDbContext.Announcements' is null.");
            }

            await AddAnnouncementImageAsync(announcement, mainImage);
            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<AnnouncementDTO>(announcement);

            return CreatedAtAction("GetAnnouncement", new { id = announcement.Id }, result);
        }

        [Authorize("IsChessClubAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            var announcement = await _context.Announcements
                .Include(a => a.Images)
                .FirstOrDefaultAsync(a => a.Id == id);

            try
            {
                if (_context.Announcements == null)
                {
                    return NotFound();
                }

                if (announcement == null)
                {
                    return NotFound();
                }

                _context.Images.RemoveRange(announcement.Images);
                _context.Announcements.Remove(announcement);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error deleting announcement with id: {announcement?.Id}! Error message {e.Message}");
                throw;
            }
        }

        private bool AnnouncementExists(Guid id)
        {
            return (_context.Announcements?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private async Task AddAnnouncementImageAsync(Announcement announcement, IFormFile file)
        {
            var imageUploadResult = await _imageAccessor.AddImage(file);
            var image = _mapper.Map<Image>(imageUploadResult);
            SetMainImage(announcement, image);
            announcement.Images.Add(image);
        }

        private void SetMainImage(Announcement announcement, Image image)
        {
            if (image == null)
            {
                _logger.LogError("Failed setting main image! The image was null!");
                return;
            }

            var currentMain = announcement.Images.FirstOrDefault(x => x.IsMain);
            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }

            image.IsMain = true;
            if (_context.Images.FirstOrDefault(x => x.Id == image.Id) == null)
            {
                _context.Images.Add(image);
            }
        }
    }
}
