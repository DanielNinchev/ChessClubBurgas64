using Microsoft.AspNetCore.Mvc;
using ChessClubBurgas64.Data.Models;
using Microsoft.AspNetCore.Authorization;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Extensions;
using ChessClubBurgas64.Web.Models.PuzzleModels;
using ChessClubBurgas64.Web.Services.Contracts;

namespace ChessClubBurgas64.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuzzlesController(ILoggerFactory loggerFactory, IPuzzlesService puzzlesService) : ControllerBase
    {
        private readonly IPuzzlesService _puzzlesService = puzzlesService;
        private readonly ILogger<PuzzlesController> _logger = loggerFactory.CreateLogger<PuzzlesController>();

        [AllowAnonymous]
        [HttpGet]
        public async Task<IResult> GetPuzzles([FromQuery] PagingParams pagingParams)
        {
            var pagedResult = await _puzzlesService.GetPuzzlesAsync(pagingParams);
            if (pagedResult == null)
            {
                return Results.NotFound();
            }

            Response.AddPaginationHeader(pagedResult.CurrentPage, pagedResult.PageSize, pagedResult.TotalCount, pagedResult.TotalPages);
            return Results.Ok(pagedResult);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<PuzzleInputModel>> GetPuzzle(int id)
        {
            var result = await _puzzlesService.GetPuzzleAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPost]
        public async Task<ActionResult<PuzzleInputModel>> PostPuzzle([FromForm] Puzzle puzzle, [FromForm] IFormFile mainImage)
        {
            var result = await _puzzlesService.CreatePuzzleAsync(puzzle, mainImage);

            return CreatedAtAction("GetPuzzle", new { id = puzzle.Id }, result);
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize("IsChessClubAdmin")]
        [HttpPut("{id}")]
        public async Task<IResult> PutPuzzle(int id, [FromForm] Puzzle updatedPuzzle, [FromForm] IFormFile mainImage)
        {
            await _puzzlesService.UpdatePuzzleAsync(id, updatedPuzzle, mainImage);

            return Results.NoContent();
        }

        [Authorize("IsChessClubAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuzzle(int id)
        {
            try
            {
                await _puzzlesService.DeletePuzzleAsync(id);

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"An error occurred while deleting puzzle! Error message {e.Message}");
                throw;
            }
        }
    }
}
