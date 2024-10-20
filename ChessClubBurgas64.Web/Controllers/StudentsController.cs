using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;

namespace ChessClubBurgas64.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
          if (_context.Students == null)
          {
              return NotFound();
          }
            return await _context.Students.ToListAsync();
        }

        // GET: api/Student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(Guid id)
        {
          if (_context.Students == null)
          {
              return NotFound();
          }
            var Student = await _context.Students.FindAsync(id);

            if (Student == null)
            {
                return NotFound();
            }

            return Student;
        }

        // PUT: api/Student/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(Guid id, Student Student)
        {
            if (id != Student.Id)
            {
                return BadRequest();
            }

            _context.Entry(Student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
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

        // POST: api/Student
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student Student)
        {
          if (_context.Students == null)
          {
              return Problem("Entity set 'AppDbContext.Students' is null.");
          }
            _context.Students.Add(Student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = Student.Id }, Student);
        }

        // DELETE: api/Student/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(Guid id)
        {
            if (_context.Students == null)
            {
                return NotFound();
            }
            var Student = await _context.Students.FindAsync(id);
            if (Student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(Student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(Guid id)
        {
            return (_context.Students?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
