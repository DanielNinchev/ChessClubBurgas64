using System.Security.Claims;
using System.Text;
using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(
    UserManager<Account> userManager,
    SignInManager<Account> signInManager,
    IEmailSender<Account> emailSender,
    IConfiguration config) : ControllerBase
{
    [HttpGet("user-info")]
    [Authorize]
    public async Task<ActionResult> GetUserInfo()
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        if (user == null) return Unauthorized();

        var roles = await userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.FirstName,
            user.MiddleName,
            user.LastName,
            Roles = roles,
        });
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);

        // Always return OK to avoid leaking user existence
        if (user == null) return Ok();

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var clientUrl = config["ClientUrl"] ?? "http://localhost:3000";
        var resetLink = $"{clientUrl}/reset-password?email={Uri.EscapeDataString(dto.Email)}&code={encodedToken}";

        await emailSender.SendPasswordResetCodeAsync(user, dto.Email, encodedToken);

        return Ok();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null) return BadRequest("Невалидна заявка");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));
        var result = await userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        return Ok();
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        // TODO: validate invitation token
        var user = new Account
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            MiddleName = registerDto.MiddleName,
            LastName = registerDto.LastName,
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        return Ok();
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        if (user == null) return Unauthorized();

        var result = await userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        return Ok();
    }
}
