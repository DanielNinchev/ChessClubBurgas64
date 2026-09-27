using System.Security.Claims;
using Application.Puzzles.Commands;
using Application.Puzzles.DTOs;
using Application.Puzzles.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PuzzlesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetPuzzles([FromQuery] PuzzleParams puzzleParams)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return HandleResult(await Mediator.Send(new GetPuzzleList.Query
            {
                Params = puzzleParams,
                UserId = userId,
            }));
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetPuzzleStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return HandleResult(await Mediator.Send(new GetPuzzleStats.Query { UserId = userId }));
        }

        [HttpGet("playlist")]
        public async Task<IActionResult> GetPuzzlePlaylist([FromQuery] int around)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return HandleResult(await Mediator.Send(new GetPuzzlePlaylist.Query { Around = around, UserId = userId }));
        }

        // The :guid constraint keeps literal routes like "stats" from ever being treated as puzzle ids
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPuzzle(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return HandleResult(await Mediator.Send(new GetPuzzleDetails.Query { Id = id, UserId = userId }));
        }

        [HttpPost]
        [Authorize(Policy = "IsChessClubAdmin")]
        public async Task<IActionResult> CreatePuzzle([FromBody] CreatePuzzleDto puzzle)
        {
            return HandleResult(await Mediator.Send(new CreatePuzzle.Command { Puzzle = puzzle }));
        }

        [HttpPut]
        [Authorize(Policy = "IsChessClubAdmin")]
        public async Task<IActionResult> EditPuzzle([FromBody] EditPuzzleDto puzzle)
        {
            return HandleResult(await Mediator.Send(new EditPuzzle.Command { Puzzle = puzzle }));
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Policy = "IsChessClubAdmin")]
        public async Task<IActionResult> DeletePuzzle(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeletePuzzle.Command { Id = id }));
        }

        [Authorize]
        [HttpPost("{id:guid}/complete")]
        public async Task<IActionResult> CompletePuzzle(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return HandleResult(await Mediator.Send(new CompletePuzzle.Command
            {
                PuzzleId = id,
                UserId = userId,
            }));
        }
    }
}