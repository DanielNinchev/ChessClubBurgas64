using AutoMapper;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Web.DTOs;
using ChessClubBurgas64.Web.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChessClubBurgas64.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(UserManager<Account> userManager, ITokenService tokenService, IMapper mapper) : ControllerBase
    {
        private readonly UserManager<Account> _userManager = userManager;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IMapper _mapper = mapper;

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);
            if (user is null)
            {
                return Unauthorized();
            }

            var successfulLogin = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (successfulLogin)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            try
            {
                if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
                {
                    ModelState.AddModelError("email", "Профил с такава електронна поща вече съществува!");
                    return ValidationProblem();
                }

                var user = _mapper.Map<Account>(registerDto);
                var result = await _userManager.CreateAsync(user, registerDto.Password);

                if (result.Succeeded)
                {
                    return CreateUserObject(user);
                }

                return BadRequest(result.Errors);
            }
            catch (Exception e)
            {
                await Console.Out.WriteLineAsync($"Error: {e.Message}");
                throw;
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(Account user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                //Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}
