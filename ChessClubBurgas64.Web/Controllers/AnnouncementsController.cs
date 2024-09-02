using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
        {
            if (_context.Announcements == null)
            {
                return NotFound();
            }
            return await _context.Announcements.ToListAsync();
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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncement(Guid id, Announcement Announcement)
        {
            if (id != Announcement.Id)
            {
                return BadRequest();
            }

            _context.Entry(Announcement).State = EntityState.Modified;

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
        [HttpPost]
        public async Task<ActionResult<Announcement>> PostAnnouncement(Announcement Announcement)
        {
            if (_context.Announcements == null)
            {
                return Problem("Entity set 'AppDbContext.Announcements' is null.");
            }

            _context.Announcements.Add(Announcement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnnouncement", new { id = Announcement.Id }, Announcement);
        }

        // DELETE: api/Announcement/id
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
