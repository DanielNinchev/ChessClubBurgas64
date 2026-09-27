using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(
    UserManager<Account> userManager,
    SignInManager<Account> signInManager,
    IEmailSender<Account> emailSender,
    EmailSender accountEmailSender,
    IConfiguration config,
    AppDbContext context) : ControllerBase
{
    [Authorize]
    [HttpGet("user-info")]
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

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null) return Ok(); // Don't reveal whether user exists

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        await emailSender.SendPasswordResetCodeAsync(user, dto.Email, encodedToken);

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null) return BadRequest("Невалидна заявка");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));
        var result = await userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);
            return ValidationProblem();
        }

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("create-invitation")]
    public async Task<ActionResult> CreateInvitation(CreateInvitationDto dto)
    {
        if (dto.Role != "Student" && dto.Role != "Teacher")
            return BadRequest("Ролята трябва да бъде Student или Teacher");

        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            return BadRequest("Потребител с този имейл вече съществува");

        var existingInvitations = await context.Invitations
            .Where(i => i.Email == dto.Email && !i.IsUsed && i.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();

        foreach (var existing in existingInvitations)
            existing.IsUsed = true;

        var tokenBytes = RandomNumberGenerator.GetBytes(32);
        var token = WebEncoders.Base64UrlEncode(tokenBytes);

        var invitation = new Invitation
        {
            Email = dto.Email,
            Role = dto.Role,
            TeacherId = dto.TeacherId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
        };

        context.Invitations.Add(invitation);
        await context.SaveChangesAsync();

        var clientUrl = config["ClientAppUrl"] ?? "http://localhost:3000";
        var registrationLink = $"{clientUrl}/register?token={token}";

        return Ok(new { registrationLink, expiresAt = invitation.ExpiresAt.ToString("o") });
    }

    [AllowAnonymous]
    [HttpGet("validate-invitation")]
    public async Task<ActionResult> ValidateInvitation([FromQuery] string token)
    {
        var invitation = await context.Invitations
            .FirstOrDefaultAsync(i => i.Token == token && !i.IsUsed && i.ExpiresAt > DateTime.UtcNow);

        if (invitation == null)
            return BadRequest("Поканата е невалидна или е изтекла");

        return Ok(new { invitation.Email, invitation.Role });
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var invitation = await context.Invitations
            .FirstOrDefaultAsync(i =>
                i.Token == registerDto.InvitationToken
                && !i.IsUsed
                && i.ExpiresAt > DateTime.UtcNow);

        if (invitation == null)
            return BadRequest("Поканата е невалидна или е изтекла");

        if (!string.Equals(invitation.Email, registerDto.Email, StringComparison.OrdinalIgnoreCase))
            return BadRequest("Имейлът не съвпада с поканата");

        var user = new Account
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            MiddleName = registerDto.MiddleName,
            LastName = registerDto.LastName,
            EmailConfirmed = false, // NOT confirmed until they click the link
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);
            return ValidationProblem();
        }

        // Assign role from invitation
        await userManager.AddToRoleAsync(user, invitation.Role);

        // Mark invitation as used
        invitation.IsUsed = true;
        await context.SaveChangesAsync();

        // Generate email confirmation token and send
        var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

        var clientUrl = config["ClientAppUrl"] ?? "http://localhost:3000";
        var confirmLink = $"{clientUrl}/confirm-email?email={Uri.EscapeDataString(user.Email!)}&token={encodedToken}";

        await emailSender.SendConfirmationLinkAsync(user, user.Email!, confirmLink);

        return Ok(new { requiresEmailConfirmation = true });
    }

    [AllowAnonymous]
    [HttpGet("confirm-email")]
    public async Task<ActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
            return BadRequest("Невалиден линк за потвърждение");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
            return BadRequest("Линкът за потвърждение е невалиден или е изтекъл");

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("resend-confirmation")]
    public async Task<ActionResult> ResendConfirmation([FromBody] ResendConfirmationDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null || user.EmailConfirmed)
            return Ok(); // Don't reveal info

        var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

        var clientUrl = config["ClientAppUrl"] ?? "http://localhost:3000";
        var confirmLink = $"{clientUrl}/confirm-email?email={Uri.EscapeDataString(user.Email!)}&token={encodedToken}";

        await emailSender.SendConfirmationLinkAsync(user, user.Email!, confirmLink);

        return Ok();
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        if (user == null) return Unauthorized();

        var result = await userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);
            return ValidationProblem();
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("change-email")]
    public async Task<ActionResult> ChangeEmail([FromBody] ChangeEmailDto dto)
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        if (user == null) return Unauthorized();

        if (!await userManager.CheckPasswordAsync(user, dto.CurrentPassword))
            return BadRequest("Грешна парола");

        if (string.Equals(user.Email, dto.NewEmail, StringComparison.OrdinalIgnoreCase))
            return BadRequest("Новият имейл съвпада с текущия");

        if (await userManager.FindByEmailAsync(dto.NewEmail) != null)
            return BadRequest("Потребител с този имейл вече съществува");

        var token = await userManager.GenerateChangeEmailTokenAsync(user, dto.NewEmail);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var clientUrl = config["ClientAppUrl"] ?? "http://localhost:3000";
        var confirmLink = $"{clientUrl}/confirm-email-change?userId={Uri.EscapeDataString(user.Id)}" +
            $"&email={Uri.EscapeDataString(dto.NewEmail)}&token={encodedToken}";

        await accountEmailSender.SendChangeEmailLinkAsync(user, dto.NewEmail, confirmLink);

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("confirm-email-change")]
    public async Task<ActionResult> ConfirmEmailChange([FromBody] ConfirmEmailChangeDto dto)
    {
        var user = await userManager.FindByIdAsync(dto.UserId);
        if (user == null) return BadRequest("Невалиден линк за потвърждение");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));
        var result = await userManager.ChangeEmailAsync(user, dto.NewEmail, decodedToken);

        if (!result.Succeeded)
            return BadRequest("Линкът за потвърждение е невалиден или е изтекъл");

        // Usernames mirror emails, so keep them in sync
        await userManager.SetUserNameAsync(user, dto.NewEmail);

        // The auth cookie still carries the old email claim - force a fresh login
        await signInManager.SignOutAsync();

        return Ok();
    }

    [Authorize]
    [HttpGet("export-data")]
    public async Task<ActionResult> ExportData()
    {
        var user = await userManager.Users
            .Include(u => u.StudentProfile)
            .Include(u => u.TeacherProfile)
            .Include(u => u.CompletedPuzzles)
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        if (user == null) return Unauthorized();

        var roles = await userManager.GetRolesAsync(user);

        var student = user.StudentProfile;
        var teacher = user.TeacherProfile;

        var attendedLessons = student == null ? [] : await context.LessonStudents
            .Where(ls => ls.StudentId == student.Id)
            .OrderBy(ls => ls.Lesson.StartingTime)
            .Select(ls => new
            {
                ls.Lesson.Topic,
                ls.Lesson.StartingTime,
                ls.IsPresent,
                ls.Notes,
            })
            .ToListAsync<object>();

        var taughtLessons = teacher == null ? [] : await context.Lessons
            .Where(l => l.TeacherId == teacher.Id)
            .OrderBy(l => l.StartingTime)
            .Select(l => new
            {
                l.Topic,
                l.StartingTime,
                l.Notes,
                StudentCount = l.LessonStudents.Count,
            })
            .ToListAsync<object>();

        var invitations = await context.Invitations
            .Where(i => i.Email == user.Email)
            .Select(i => new { i.Role, i.CreatedAt, i.ExpiresAt, i.IsUsed })
            .ToListAsync();

        var export = new
        {
            ExportedAt = DateTime.UtcNow,
            Account = new
            {
                user.Id,
                user.Email,
                user.EmailConfirmed,
                user.FirstName,
                user.MiddleName,
                user.LastName,
                user.PhoneNumber,
                user.Rating,
                Roles = roles,
            },
            StudentProfile = student == null ? null : new
            {
                student.BirthDate,
                student.Address,
                student.School,
                student.PhoneNumber,
                student.DateOfJoiningClub,
                student.ClubRating,
                student.FideRating,
                student.PuzzlePoints,
                student.IsFiled,
            },
            TeacherProfile = teacher == null ? null : new
            {
                teacher.Bio,
                teacher.Specialization,
            },
            AttendedLessons = attendedLessons,
            TaughtLessons = taughtLessons,
            CompletedPuzzles = user.CompletedPuzzles
                .OrderBy(p => p.Number)
                .Select(p => new { p.Number, p.Category, p.Difficulty, p.Points }),
            Invitations = invitations,
        };

        var json = JsonSerializer.SerializeToUtf8Bytes(export, new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All),
        });

        return File(json, "application/json", $"chessclub-burgas64-data-{DateTime.UtcNow:yyyy-MM-dd}.json");
    }
}
