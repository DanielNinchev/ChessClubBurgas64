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
        [AllowAnonymous]
        public async Task<IActionResult> GetPuzzles([FromQuery] PuzzleParams puzzleParams)
        {
            return HandleResult(await Mediator.Send(new GetPuzzleList.Query
            {
                Params = puzzleParams
            }));
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPuzzle(string id)
        {
            return HandleResult(await Mediator.Send(new GetPuzzleDetails.Query { Id = id }));
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

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsChessClubAdmin")]
        public async Task<IActionResult> DeletePuzzle(string id)
        {
            return HandleResult(await Mediator.Send(new DeletePuzzle.Command { Id = id }));
        }
    }
}