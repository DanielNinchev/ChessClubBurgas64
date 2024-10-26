using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Application.Core;
using ChessClubBurgas64.Web.Core.PagingParams;

namespace ChessClubBurgas64.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        // GET: api/Announcement
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

            
            var pagedList = await PagedList<Announcement>.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
            var paginationMetadata = new
            {
                pagedList.CurrentPage,
                pagedList.PageSize,
                pagedList.TotalCount,
                pagedList.TotalPages
            };

            Response.Headers.Append("X-Pagination", Newtonsoft.Json.JsonConvert.SerializeObject(paginationMetadata));
            return Results.Ok(pagedList);
        }

        // GET: api/Announcement/5
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

        // PUT: api/Announcement/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncement(Guid id, Announcement аnnouncement)
        {
            if (id != аnnouncement.Id)
            {
                return BadRequest();
            }

            _context.Entry(аnnouncement).State = EntityState.Modified;

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

        // POST: api/Announcement
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPost]
        public async Task<ActionResult<Announcement>> PostAnnouncement(Announcement аnnouncement)
        {
            if (_context.Announcements == null)
            {
                return Problem("Entity set 'AppDbContext.Announcements' is null.");
            }

            _context.Announcements.Add(аnnouncement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnnouncement", new { id = аnnouncement.Id }, аnnouncement);
        }

        // DELETE: api/Announcement/id
        [Authorize("IsChessClubAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
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

            _context.Announcements.Remove(Announcement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnnouncementExists(Guid id)
        {
            return (_context.Announcements?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
